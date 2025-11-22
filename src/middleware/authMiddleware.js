const jwt = require('jsonwebtoken');
const { supabase } = require('../utils/database');
const { ApiResponse } = require('../utils/apiResponse');

// Authenticate user with JWT token
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return ApiResponse.error(res, 'Authentication token required', 401);
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user profile from database
    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, user_role, user_status')
      .eq('id', decoded.id)
      .eq('user_status', 'active')
      .single();

    if (error || !user) {
      return ApiResponse.error(res, 'Invalid authentication token', 401);
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.user_role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.error(res, 'Invalid token', 401);
    }
    
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Token expired', 401);
    }
    
    return ApiResponse.error(res, 'Authentication failed', 401);
  }
};

// Optional authentication (for public endpoints that can benefit from user context)
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, user_role, user_status')
      .eq('id', decoded.id)
      .eq('user_status', 'active')
      .single();

    if (!error && user) {
      req.user = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.user_role
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};