// Simple test endpoint to verify deployment
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'not set',
    hasMongoURI: !!process.env.MONGODB_URI,
    hasJWTSecret: !!process.env.JWT_SECRET,
    hasFrontendURL: !!process.env.FRONTEND_URL
  });
});

module.exports = app;