/**
 * Interactive Environment Setup Script
 * 
 * This script helps you configure the .env file interactively.
 * Run: node setup-env.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(`${colors.cyan}${prompt}${colors.reset}`, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupEnvironment() {
  log('\n' + '='.repeat(60), 'cyan');
  log('AQAR PLATFORM - ENVIRONMENT SETUP', 'cyan');
  log('='.repeat(60), 'cyan');
  log('\nThis script will help you configure your .env file.\n', 'blue');

  const config = {};

  // Port
  log('\n--- Server Configuration ---', 'yellow');
  const port = await question('Server port (default: 5000): ');
  config.PORT = port || '5000';

  // MongoDB
  log('\n--- MongoDB Configuration ---', 'yellow');
  log('Choose MongoDB option:', 'blue');
  log('1. MongoDB Atlas (Cloud) - Recommended', 'blue');
  log('2. Local MongoDB', 'blue');
  const mongoChoice = await question('Enter choice (1 or 2): ');

  if (mongoChoice === '1') {
    log('\nFollow these steps to get your MongoDB Atlas connection string:', 'blue');
    log('1. Go to https://cloud.mongodb.com/', 'blue');
    log('2. Create a free cluster (M0)', 'blue');
    log('3. Create a database user', 'blue');
    log('4. Whitelist your IP (or use 0.0.0.0/0 for development)', 'blue');
    log('5. Click "Connect" → "Connect your application" → Copy connection string', 'blue');
    log('\nExample: mongodb+srv://username:password@cluster.xxxxx.mongodb.net/aqar\n', 'blue');
    
    const mongoUri = await question('Paste your MongoDB Atlas connection string: ');
    config.MONGO_URI = mongoUri || 'mongodb+srv://<user>:<password>@cluster.mongodb.net/aqar';
  } else {
    log('\nUsing local MongoDB (ensure MongoDB is installed and running)', 'blue');
    const dbName = await question('Database name (default: aqar): ');
    config.MONGO_URI = `mongodb://localhost:27017/${dbName || 'aqar'}`;
  }

  // JWT
  log('\n--- JWT Configuration ---', 'yellow');
  log('Generating secure JWT secret...', 'blue');
  const jwtSecret = crypto.randomBytes(32).toString('hex');
  config.JWT_SECRET = jwtSecret;
  config.JWT_EXPIRE = '7d';
  log(`✓ JWT Secret generated: ${jwtSecret.substring(0, 20)}...`, 'green');

  // Cloudinary
  log('\n--- Cloudinary Configuration ---', 'yellow');
  log('Cloudinary is used for image uploads. You can skip this for now.', 'blue');
  log('To get credentials: https://cloudinary.com/users/register/free', 'blue');
  const setupCloudinary = await question('Do you want to configure Cloudinary now? (y/n): ');

  if (setupCloudinary.toLowerCase() === 'y') {
    log('\nGet your credentials from: https://cloudinary.com/console', 'blue');
    const cloudName = await question('Cloud Name: ');
    const apiKey = await question('API Key: ');
    const apiSecret = await question('API Secret: ');
    
    config.CLOUDINARY_CLOUD_NAME = cloudName || 'your_cloud_name';
    config.CLOUDINARY_API_KEY = apiKey || 'your_api_key';
    config.CLOUDINARY_API_SECRET = apiSecret || 'your_api_secret';
  } else {
    config.CLOUDINARY_CLOUD_NAME = 'your_cloud_name';
    config.CLOUDINARY_API_KEY = 'your_api_key';
    config.CLOUDINARY_API_SECRET = 'your_api_secret';
    log('⚠ Cloudinary not configured. Image uploads will fail until configured.', 'yellow');
  }

  // Client Origin
  log('\n--- CORS Configuration ---', 'yellow');
  const clientOrigin = await question('Frontend URL (default: http://localhost:5173): ');
  config.CLIENT_ORIGIN = clientOrigin || 'http://localhost:5173';

  // Generate .env content
  const envContent = `# Aqar Platform Environment Configuration
# Generated on ${new Date().toISOString()}

# Server Configuration
PORT=${config.PORT}
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=${config.MONGO_URI}

# JWT Configuration
JWT_SECRET=${config.JWT_SECRET}
JWT_EXPIRE=${config.JWT_EXPIRE}

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=${config.CLOUDINARY_CLOUD_NAME}
CLOUDINARY_API_KEY=${config.CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${config.CLOUDINARY_API_SECRET}

# CORS Configuration
CLIENT_ORIGIN=${config.CLIENT_ORIGIN}
`;

  // Save to .env file
  const envPath = path.join(__dirname, '.env');
  
  log('\n--- Summary ---', 'yellow');
  log(`Port: ${config.PORT}`, 'blue');
  log(`MongoDB: ${config.MONGO_URI.substring(0, 50)}...`, 'blue');
  log(`JWT Secret: ${config.JWT_SECRET.substring(0, 20)}...`, 'blue');
  log(`Cloudinary: ${config.CLOUDINARY_CLOUD_NAME}`, 'blue');
  log(`Client Origin: ${config.CLIENT_ORIGIN}`, 'blue');

  const confirm = await question('\nSave this configuration to .env? (y/n): ');

  if (confirm.toLowerCase() === 'y') {
    // Backup existing .env if it exists
    if (fs.existsSync(envPath)) {
      const backupPath = path.join(__dirname, `.env.backup.${Date.now()}`);
      fs.copyFileSync(envPath, backupPath);
      log(`\n✓ Existing .env backed up to: ${path.basename(backupPath)}`, 'green');
    }

    // Write new .env
    fs.writeFileSync(envPath, envContent);
    log('✓ Configuration saved to .env', 'green');

    log('\n--- Next Steps ---', 'yellow');
    log('1. Review the .env file and update any placeholder values', 'blue');
    log('2. Start the server: npm run dev', 'blue');
    log('3. Test the API: node manual-api-tests.js', 'blue');
    log('4. Read MONGODB-SETUP-GUIDE.md for detailed setup instructions', 'blue');

    log('\n✅ Setup complete!', 'green');
  } else {
    log('\n❌ Configuration not saved. Run this script again when ready.', 'red');
  }

  rl.close();
}

// Run setup
setupEnvironment().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});
