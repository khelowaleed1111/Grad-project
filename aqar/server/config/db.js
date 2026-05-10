const mongoose = require('mongoose');
const dns = require('dns');

// Use Google DNS to avoid local DNS issues
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);

/**
 * Connect to MongoDB database with retry logic
 * @param {number} retries - Number of retry attempts (default: 5)
 * @param {number} delay - Delay between retries in ms (default: 5000)
 * @returns {Promise<void>}
 */
const connectDB = async (retries = 5, delay = 5000) => {
  let attempt = 0;

  const attemptConnection = async () => {
    try {
      attempt++;
      console.log(`🔄 Attempting MongoDB connection (Attempt ${attempt}/${retries})...`);

      const conn = await mongoose.connect(process.env.MONGO_URI, {
        // Mongoose 6+ doesn't need useNewUrlParser and useUnifiedTopology
        // but we can add serverSelectionTimeoutMS for faster fail
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4, skip trying IPv6
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);

      return conn;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${attempt} failed:`, error.message);

      if (attempt < retries) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return attemptConnection();
      } else {
        console.error(`💥 Failed to connect to MongoDB after ${retries} attempts`);
        console.error('\n💡 Troubleshooting:');
        console.error('   1. Check MongoDB Atlas cluster is running (not paused)');
        console.error('   2. Verify IP whitelist in Network Access (try 0.0.0.0/0)');
        console.error('   3. Confirm username and password are correct');
        console.error('   4. Check firewall settings');
        
        // Don't exit in test environment - let tests handle their own connections
        if (process.env.NODE_ENV !== 'test') {
          process.exit(1);
        } else {
          throw new Error(`Failed to connect to MongoDB after ${retries} attempts`);
        }
      }
    }
  };

  await attemptConnection();
};

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 Mongoose reconnected to MongoDB');
});

// Graceful shutdown handlers
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 ${signal} received. Closing MongoDB connection...`);
  try {
    await mongoose.connection.close();
    console.log('🔴 MongoDB connection closed gracefully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during MongoDB connection closure:', error);
    process.exit(1);
  }
};

// Handle different termination signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

module.exports = connectDB;
