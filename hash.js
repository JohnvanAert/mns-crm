const bcrypt = require('bcryptjs');

const password = 'root';
const saltRounds = 10; // This defines the strength of the salt

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});