const { ApiResponse } = require('../utils/apiResponse');

// Check if user has required role
exports.requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 'Authentication required', 401);
    }

    const userRole = req.user.role;
    
    // Convert single role to array for consistency
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (!roles.includes(userRole)) {
      return ApiResponse.error(res, 'Insufficient permissions', 403);
    }

    next();
  };
};

// Specific role middlewares for convenience
exports.adminOnly = exports.requireRole(['admin']);
exports.staffOnly = exports.requireRole(['staff', 'admin']);
exports.customerOnly = exports.requireRole(['customer']);
exports.staffOrAdmin = exports.requireRole(['staff', 'admin']);
exports.anyRole = exports.requireRole(['customer', 'staff', 'admin']);

// Check if user owns the resource or has admin/staff privileges
exports.ownerOrStaff = (resourceIdField = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 'Authentication required', 401);
    }

    const userRole = req.user.role;
    const userId = req.user.id;
    const resourceUserId = req.params[resourceIdField] || req.body[resourceIdField];

    // Admin and staff can access any resource
    if (userRole === 'admin' || userRole === 'staff') {
      return next();
    }

    // Customer can only access their own resources
    if (userRole === 'customer' && userId === resourceUserId) {
      return next();
    }

    return ApiResponse.error(res, 'Access denied', 403);
  };
};