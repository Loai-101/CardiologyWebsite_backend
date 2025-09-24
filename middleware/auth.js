const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify admin token middleware
const verifyAdminToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('🔐 Admin token verification:', {
      hasToken: !!token,
      tokenLength: token?.length,
      jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      jwtSecretLength: process.env.JWT_SECRET?.length
    });
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded successfully:', { userId: decoded.userId });
    
    // Check if user exists and is admin
    const user = await User.findById(decoded.userId);
    console.log('👤 User found:', { 
      userExists: !!user, 
      userRole: user?.role,
      userId: user?._id 
    });
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Token verification error:', {
      name: error.name,
      message: error.message,
      jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET'
    });
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Verify user token middleware (for regular users)
const verifyUserToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. User not found.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

module.exports = {
  verifyAdminToken,
  verifyUserToken
};
