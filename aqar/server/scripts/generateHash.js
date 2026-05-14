const bcrypt = require('bcryptjs');

// Your password
const password = 'Enzoloda_22104';

console.log('');
console.log('Generating bcrypt hash for password:', password);
console.log('Please wait...');
console.log('');

bcrypt.hash(password, 12, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PASSWORD HASH GENERATED');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('Password:', password);
  console.log('');
  console.log('Bcrypt Hash (copy this):');
  console.log(hash);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('INSTRUCTIONS:');
  console.log('1. Open MongoDB Compass');
  console.log('2. Find your user: khelowaleed@gmail.com');
  console.log('3. Edit the document');
  console.log('4. Replace the "password" field value with the hash above');
  console.log('5. Click Update');
  console.log('6. Try logging in again');
  console.log('');
});
