const jwt = require('jsonwebtoken');
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET; 

const token = jwt.sign(
  { id: user._id }, 
  SECRET_KEY,       
  { expiresIn: process.env.JWT_EXPIRES_IN }
);

console.log(token);
