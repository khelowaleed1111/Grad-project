require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ── Middleware ──────────────────────────────────────
app.use(helmet());

// CORS - strip trailing slash and allow multiple origins
const allowedOrigins = [
  (process.env.CLIENT_ORIGIN || 'http://localhost:5173').replace(/\/$/, ''),
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── Routes ──────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Aqar API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// ── Start Server ────────────────────────────────────
const PORT = process.env.PORT || 5000;

// For Vercel serverless deployment
if (process.env.VERCEL) {
  // Don't connect here - api/index.js handles the connection
  console.log('Running in Vercel serverless mode');
} else {
  // For local development
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 API: http://localhost:${PORT}/api`);
        console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
      });
    } catch (error) {
      console.error('💥 Failed to start server:', error.message);
      process.exit(1);
    }
  };

  startServer();

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Closing MongoDB connection...');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('🛑 SIGINT received. Closing MongoDB connection...');
    process.exit(0);
  });
}

module.exports = app;
