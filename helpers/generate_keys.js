const crypto = require('crypto');   //built-in nodejs module

const key1 = crypto.randomBytes(32).toString('hex');
console.log("key1 = ",key1);
