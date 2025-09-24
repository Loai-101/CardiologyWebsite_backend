// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://cardiology-hospital.vercel.app',
    'https://cardiology-website-frontend.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://pmi_it:Loai-66343439@cluster0.e0rjr.mongodb.net/cardiology_hospital?retryWrites=true&w=majority';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Import routes
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/users');
const appointmentRoutes = require('../routes/appointments');
const offerRoutes = require('../routes/offers');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/slider', offerRoutes); // Slider routes are in offers.js

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cardiology Hospital API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      test: '/api/test',
      auth: '/api/auth',
      users: '/api/users',
      appointments: '/api/appointments',
      offers: '/api/offers',
      slider: '/api/slider'
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cardiology Hospital API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// CORS test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('='.repeat(60));
  console.error('❌ SERVER ERROR');
  console.error('='.repeat(60));
  console.error('Error Message:', err.message);
  console.error('Error Stack:', err.stack);
  console.error('Request URL:', req.url);
  console.error('Request Method:', req.method);
  console.error('Request Headers:', req.headers);
  console.error('='.repeat(60));
  
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      root: '/',
      health: '/api/health',
      test: '/api/test',
      auth: '/api/auth/*',
      users: '/api/users/*',
      appointments: '/api/appointments/*',
      offers: '/api/offers/*',
      slider: '/api/slider/*'
    },
    timestamp: new Date().toISOString()
  });
});

// Export for Vercel
module.exports = app;

