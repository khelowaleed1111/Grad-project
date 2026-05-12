// Vercel serverless function entry point
require('dotenv').config();
const mongoose = require('mongoose');

// Cache the MongoDB connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    cachedDb = db;
    console.log('New database connection established');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Import the Express app
const app = require('../server');

// Export the serverless function handler
module.exports = async (req, res) => {
  try {
    // Ensure database is connected
    await connectToDatabase();
    
    // Handle the request with Express
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Serverless function error',
      error: error.message 
    });
  }
};
