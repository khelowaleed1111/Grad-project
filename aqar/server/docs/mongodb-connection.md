# MongoDB Connection Configuration

## Overview

The MongoDB connection module (`config/db.js`) provides a robust, production-ready connection handler with retry logic, comprehensive error handling, and graceful shutdown capabilities.

## Features

### 1. **Retry Logic**
- Automatically retries failed connections up to 5 times
- 5-second delay between retry attempts
- Configurable retry count and delay
- Detailed logging for each attempt

### 2. **Connection Event Listeners**
- `connected`: Fires when initial connection is established
- `error`: Fires when connection errors occur
- `disconnected`: Fires when connection is lost
- `reconnected`: Fires when connection is re-established

### 3. **Graceful Shutdown**
- Handles `SIGINT` (Ctrl+C)
- Handles `SIGTERM` (process termination)
- Handles `uncaughtException` events
- Ensures MongoDB connection is properly closed before exit

### 4. **Error Handling**
- Comprehensive error logging with emojis for visibility
- Exits process after max retry attempts
- Provides detailed error messages for debugging

## Configuration

### Environment Variables

The connection requires the following environment variable in `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
```

**Examples:**

Local MongoDB:
```env
MONGO_URI=mongodb://localhost:27017/aqar
```

MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/aqar
```

## Usage

### Basic Usage

```javascript
const connectDB = require('./config/db');

// Connect with default settings (5 retries, 5s delay)
connectDB();
```

### Custom Retry Configuration

```javascript
const connectDB = require('./config/db');

// Connect with custom retry settings
connectDB(3, 3000); // 3 retries, 3 second delay
```

## Connection Flow

```
1. Attempt connection (Attempt 1/5)
   ├─ Success → Log success message
   │           → Register event listeners
   │           → Continue application startup
   │
   └─ Failure → Log error
              → Wait 5 seconds
              → Retry (Attempt 2/5)
              → ... repeat until success or max retries
              → Exit process if all attempts fail
```

## Event Handling

### Connected Event
```javascript
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});
```

### Error Event
```javascript
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});
```

### Disconnected Event
```javascript
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose disconnected from MongoDB');
});
```

### Reconnected Event
```javascript
mongoose.connection.on('reconnected', () => {
  console.log('🔄 Mongoose reconnected to MongoDB');
});
```

## Graceful Shutdown

The module handles multiple shutdown scenarios:

### SIGINT (Ctrl+C)
```bash
# User presses Ctrl+C
🛑 SIGINT received. Closing MongoDB connection...
🔴 MongoDB connection closed gracefully
```

### SIGTERM (Process Termination)
```bash
# Process manager sends SIGTERM
🛑 SIGTERM received. Closing MongoDB connection...
🔴 MongoDB connection closed gracefully
```

### Uncaught Exception
```bash
# Unhandled error occurs
💥 Uncaught Exception: <error details>
🛑 uncaughtException received. Closing MongoDB connection...
🔴 MongoDB connection closed gracefully
```

## Testing

### Manual Test

Run the test script to verify connection:

```bash
node test-db-connection.js
```

### Expected Output (Success)

```
============================================================
MongoDB Connection Test
============================================================

Environment Variables:
- MONGO_URI: ✓ Set
- PORT: 5000

Starting connection test...

🔄 Attempting MongoDB connection (Attempt 1/5)...
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
📊 Database: aqar
🟢 Mongoose connected to MongoDB

============================================================
✅ Connection test completed successfully!
============================================================

Features verified:
  ✓ MongoDB connection established
  ✓ Retry logic implemented (5 attempts with 5s delay)
  ✓ Connection event listeners registered
  ✓ Graceful shutdown handlers configured
  ✓ Error handling with detailed logging

Press Ctrl+C to test graceful shutdown...
```

### Expected Output (Failure)

```
============================================================
MongoDB Connection Test
============================================================

Environment Variables:
- MONGO_URI: ✓ Set
- PORT: 5000

Starting connection test...

🔄 Attempting MongoDB connection (Attempt 1/5)...
❌ MongoDB connection attempt 1 failed: connect ECONNREFUSED
⏳ Retrying in 5 seconds...
🔄 Attempting MongoDB connection (Attempt 2/5)...
❌ MongoDB connection attempt 2 failed: connect ECONNREFUSED
⏳ Retrying in 5 seconds...
...
💥 Failed to connect to MongoDB after 5 attempts

============================================================
❌ Connection test failed!
============================================================

Error: connect ECONNREFUSED

Troubleshooting:
  1. Check if MONGO_URI is correctly set in .env
  2. Verify MongoDB credentials are correct
  3. Ensure MongoDB server is running and accessible
  4. Check network connectivity
```

## Troubleshooting

### Connection Timeout

**Problem:** Connection times out after 5 seconds

**Solution:**
- Check if MongoDB server is running
- Verify network connectivity
- Check firewall settings
- Ensure IP address is whitelisted (MongoDB Atlas)

### Authentication Failed

**Problem:** Authentication error

**Solution:**
- Verify username and password in MONGO_URI
- Check if user has correct permissions
- Ensure database name is correct

### Network Error

**Problem:** Network unreachable

**Solution:**
- Check internet connection
- Verify MongoDB Atlas cluster is running
- Check if IP address is whitelisted
- Try using VPN if behind restrictive firewall

### Too Many Connections

**Problem:** MongoServerError: too many connections

**Solution:**
- Close unused connections
- Implement connection pooling
- Upgrade MongoDB plan (Atlas)
- Check for connection leaks in application

## Best Practices

### 1. Environment Variables
- Never commit `.env` file to version control
- Use different databases for development, staging, and production
- Rotate credentials regularly

### 2. Connection Pooling
Mongoose handles connection pooling automatically. Default settings:
- Pool size: 5 connections
- Server selection timeout: 5000ms

### 3. Error Monitoring
- Implement error logging service (e.g., Sentry, LogRocket)
- Monitor connection events in production
- Set up alerts for connection failures

### 4. Security
- Use strong passwords
- Enable IP whitelisting (Atlas)
- Use TLS/SSL for connections
- Implement network encryption

## Production Considerations

### MongoDB Atlas Setup

1. **Create Cluster**
   - Choose appropriate tier (M0 for free, M10+ for production)
   - Select region closest to application servers
   - Enable backups

2. **Network Access**
   - Whitelist application server IPs
   - Use VPC peering for enhanced security
   - Enable private endpoints

3. **Database Access**
   - Create dedicated user for application
   - Grant minimum required permissions
   - Use strong passwords

4. **Monitoring**
   - Enable Atlas monitoring
   - Set up performance alerts
   - Monitor slow queries

### Local Development

1. **Install MongoDB**
   ```bash
   # Windows (using Chocolatey)
   choco install mongodb
   
   # macOS (using Homebrew)
   brew install mongodb-community
   
   # Linux (Ubuntu)
   sudo apt-get install mongodb
   ```

2. **Start MongoDB**
   ```bash
   # Windows
   mongod --dbpath C:\data\db
   
   # macOS/Linux
   mongod --dbpath /data/db
   ```

3. **Update .env**
   ```env
   MONGO_URI=mongodb://localhost:27017/aqar
   ```

## Related Files

- `config/db.js` - Main connection module
- `server.js` - Application entry point
- `.env` - Environment configuration
- `.env.example` - Environment template
- `test-db-connection.js` - Connection test script

## References

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Connection String](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Node.js Process Events](https://nodejs.org/api/process.html#process_signal_events)
