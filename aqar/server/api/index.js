// Vercel serverless function entry point
const connectDB = require('../config/db');

// Connect to MongoDB once (Vercel will cache this connection)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    await connectDB();
    isConnected = true;
    console.log('MongoDB connected for serverless function');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Import the Express app
const app = require('../server');

// Export handler that ensures DB connection before handling requests
module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};
