const bcrypt = require('bcryptjs');

const password = 'Enzoloda_22104';

bcrypt.hash(password, 12, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('');
  console.log('Password:', password);
  console.log('');
  console.log('Bcrypt Hash:');
  console.log(hash);
  console.log('');
  console.log('Use this hash in MongoDB when creating the admin user.');
  console.log('');
});
