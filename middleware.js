var express = require('express');

// Middleware functions
const jsonParser = express.json();
const urlencodedParser = express.urlencoded({ extended: true }); // Allows nested objects
const staticMiddleware = express.static('public'); // Serve static files from 'public' directory

module.exports = {
  jsonParser,
  urlencodedParser,
  staticMiddleware,
};