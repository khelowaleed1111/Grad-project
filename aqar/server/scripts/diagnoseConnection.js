require('dotenv').config();
const dns = require('dns').promises;
const https = require('https');

/**
 * Diagnose MongoDB Connection Issues
 * Performs various checks to identify connection problems
 */

const diagnoseConnection = async () => {
  console.log('🔍 MongoDB Connection Diagnostics\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // 1. Check environment variables
  console.log('1️⃣  Checking Environment Variables...');
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    console.log('❌ MONGO_URI is not set in .env file\n');
    return;
  }

  // Parse MongoDB URI
  const uriMatch = mongoUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/(.+)/);
  
  if (!uriMatch) {
    console.log('❌ Invalid MongoDB URI format\n');
    console.log('Expected format: mongodb+srv://username:password@cluster.mongodb.net/database\n');
    return;
  }

  const [, username, password, host, database] = uriMatch;
  console.log('✅ Environment variables loaded');
  console.log(`   Username: ${username}`);
  console.log(`   Host: ${host}`);
  console.log(`   Database: ${database}\n`);

  // 2. Check DNS resolution
  console.log('2️⃣  Testing DNS Resolution...');
  try {
    const srvRecord = `_mongodb._tcp.${host}`;
    console.log(`   Looking up SRV record: ${srvRecord}`);
    
    const records = await dns.resolveSrv(srvRecord);
    console.log(`✅ DNS resolution successful`);
    console.log(`   Found ${records.length} MongoDB server(s):`);
    records.forEach((record, i) => {
      console.log(`   ${i + 1}. ${record.name}:${record.port} (priority: ${record.priority})`);
    });
    console.log('');
  } catch (error) {
    console.log(`❌ DNS resolution failed: ${error.message}`);
    console.log('\n💡 Possible causes:');
    console.log('   • Internet connection issues');
    console.log('   • DNS server problems');
    console.log('   • Firewall blocking DNS queries');
    console.log('   • MongoDB cluster hostname is incorrect');
    console.log('   • MongoDB cluster might be deleted or paused\n');
    
    // Try alternative DNS servers
    console.log('   Trying alternative DNS resolution...');
    try {
      const resolver = new dns.Resolver();
      resolver.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS
      const records = await resolver.resolveSrv(`_mongodb._tcp.${host}`);
      console.log(`   ✅ Alternative DNS successful (using Google DNS)`);
      console.log(`   Found ${records.length} server(s)\n`);
    } catch (altError) {
      console.log(`   ❌ Alternative DNS also failed: ${altError.message}\n`);
    }
  }

  // 3. Check internet connectivity
  console.log('3️⃣  Testing Internet Connectivity...');
  try {
    await new Promise((resolve, reject) => {
      https.get('https://www.google.com', (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      }).on('error', reject);
    });
    console.log('✅ Internet connection is working\n');
  } catch (error) {
    console.log(`❌ Internet connection test failed: ${error.message}`);
    console.log('   Please check your internet connection\n');
  }

  // 4. Check MongoDB Atlas connectivity
  console.log('4️⃣  Testing MongoDB Atlas Connectivity...');
  try {
    await new Promise((resolve, reject) => {
      https.get('https://cloud.mongodb.com', (res) => {
        if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
          resolve();
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      }).on('error', reject);
    });
    console.log('✅ Can reach MongoDB Atlas servers\n');
  } catch (error) {
    console.log(`❌ Cannot reach MongoDB Atlas: ${error.message}`);
    console.log('   MongoDB Atlas might be blocked by firewall\n');
  }

  // 5. Recommendations
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\n📋 Recommendations:\n');
  console.log('1. Verify MongoDB Atlas Cluster Status:');
  console.log('   • Log in to https://cloud.mongodb.com');
  console.log('   • Check if your cluster is running (not paused)');
  console.log('   • Verify the cluster hostname matches your .env file\n');
  
  console.log('2. Check Network Access:');
  console.log('   • In MongoDB Atlas, go to Network Access');
  console.log('   • Add your current IP address or use 0.0.0.0/0 for testing');
  console.log('   • Ensure the IP whitelist is not blocking your connection\n');
  
  console.log('3. Verify Database User:');
  console.log('   • In MongoDB Atlas, go to Database Access');
  console.log('   • Verify the username and password are correct');
  console.log('   • Ensure the user has read/write permissions\n');
  
  console.log('4. Try Alternative Connection String:');
  console.log('   • In MongoDB Atlas, click "Connect"');
  console.log('   • Choose "Connect your application"');
  console.log('   • Copy the new connection string');
  console.log('   • Update MONGO_URI in your .env file\n');
  
  console.log('5. Test with MongoDB Compass:');
  console.log('   • Download MongoDB Compass (GUI tool)');
  console.log('   • Try connecting with the same connection string');
  console.log('   • This will help isolate if it\'s a code or network issue\n');

  console.log('═══════════════════════════════════════════════════════════\n');
};

// Run diagnostics
diagnoseConnection().catch(console.error);
