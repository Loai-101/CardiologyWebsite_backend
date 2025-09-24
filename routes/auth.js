const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { verifyUserToken } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  console.log('Using JWT secret:', secret ? 'Secret is set' : 'Using fallback secret');
  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Admin login route
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    console.log('🔐 Admin login attempt:', {
      username: req.body.username,
      passwordLength: req.body.password?.length,
      origin: req.headers.origin,
      userAgent: req.headers['user-agent']
    });

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    // Check if admin credentials are configured
    const adminUsername = process.env.ADMIN_USERNAME || 'pmi';
    const adminPassword = process.env.ADMIN_PASSWORD || '123';
    console.log('=== ADMIN LOGIN ATTEMPT - UPDATED CODE VERSION ===');
    console.log('Admin username:', adminUsername);
    console.log('Admin password length:', adminPassword.length);
    console.log('Admin password value:', adminPassword);
    console.log('Received username:', username);

    // Find or create admin user
    console.log('Looking for admin user...');
    let adminUser = await User.findOne({ role: 'admin' });
    console.log('Admin user found:', adminUser ? 'Yes' : 'No');
    
    if (!adminUser) {
      // Create admin user if it doesn't exist
      try {
        // Check if admin email already exists
        const existingAdmin = await User.findOne({ email: 'admin@cardiologyhospital.com' });
        if (existingAdmin) {
          // Update existing user to be admin
          existingAdmin.role = 'admin';
          existingAdmin.status = 'approved';
          await existingAdmin.save();
          adminUser = existingAdmin;
          console.log('Existing user updated to admin');
        } else {
          // Create new admin user
          adminUser = new User({
            firstName: 'PMI',
            lastName: 'Admin',
            email: 'admin@cardiologyhospital.com',
            phone: '+973 12345678',
            countryCode: '+973',
            dateOfBirth: new Date('1990-01-01'),
            gender: 'male',
            password: adminPassword,
            role: 'admin',
            status: 'approved'
          });
          await adminUser.save();
          console.log('Admin user created successfully');
        }
      } catch (error) {
        console.error('Error creating/updating admin user:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to create admin user: ' + error.message
        });
      }
    }

    // Check admin credentials
    try {
      const isPasswordValid = await adminUser.comparePassword(password);
      console.log('Password validation result:', isPasswordValid);
      console.log('Username match:', username === adminUsername);
      
      if (username === adminUsername && isPasswordValid) {
        // Generate token
        const token = generateToken(adminUser._id);

        res.json({
          success: true,
          message: 'Admin login successful',
          token,
          user: {
            id: adminUser._id,
            firstName: adminUser.firstName,
            lastName: adminUser.lastName,
            email: adminUser.email,
            role: adminUser.role,
            status: adminUser.status
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid admin credentials'
        });
      }
    } catch (error) {
      console.error('Error during password comparison:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// User signup route
router.post('/signup', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('countryCode').notEmpty().withMessage('Country code is required'),
  body('dateOfBirth').isISO8601().withMessage('Please enter a valid date of birth'),
  body('gender').isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Please select a valid gender'),
  body('address').custom((value) => {
    if (!value || typeof value !== 'object') {
      throw new Error('Address must be an object');
    }
    if (!value.street || !value.street.trim()) {
      throw new Error('Street address is required');
    }
    if (!value.city || !value.city.trim()) {
      throw new Error('City is required');
    }
    if (!value.state || !value.state.trim()) {
      throw new Error('State/Province is required');
    }
    if (!value.postalCode || !value.postalCode.trim()) {
      throw new Error('Postal code is required');
    }
    if (!value.country || !value.country.trim()) {
      throw new Error('Country is required');
    }
    return true;
  })
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      countryCode,
      dateOfBirth,
      gender,
      address
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate age (must be at least 18)
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      actualAge--;
    }
    
    if (actualAge < 18) {
      return res.status(400).json({
        success: false,
        message: 'You must be at least 18 years old to register'
      });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      countryCode: countryCode || '+973',
      dateOfBirth,
      gender,
      address,
      role: 'user',
      status: 'registered'
    });

    await newUser.save();

    // Return user data without password
    const userResponse = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      countryCode: newUser.countryCode,
      dateOfBirth: newUser.dateOfBirth,
      gender: newUser.gender,
      address: newUser.address,
      role: newUser.role,
      status: newUser.status,
      signupTime: newUser.signupTime
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Verify token (for both admin and user)
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Find user in database
    const User = require('../models/User');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. User not found.'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      userId: user._id,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
});

module.exports = router;
