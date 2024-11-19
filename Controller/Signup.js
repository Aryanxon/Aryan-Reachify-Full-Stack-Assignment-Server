const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: true },
  });
  
  const Signup = mongoose.model('Signup', userSchema);

  module.exports = Signup;