const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mbk_skillos_production_secret_key_2026_jwt';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'mbk_skillos_refresh_secret_key_2026_jwt';

/**
 * Generate Access and Refresh tokens for a user
 */
const generateTokens = (user) => {
  const payload = {
    id: user._id || user.id || user.email,
    email: user.email,
    role: user.role || 'Student',
    fullName: user.fullName || user.name || '',
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ id: payload.id, email: payload.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

/**
 * Middleware to authenticate and verify JWT Access Token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token required. Please sign in.',
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired session. Please sign in again.',
      });
    }
    req.user = user;
    next();
  });
};

/**
 * Optional authentication: if token is present, decode it; otherwise proceed without error
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err && user) {
      req.user = user;
    } else {
      req.user = null;
    }
    next();
  });
};

/**
 * Role-Based Access Control (RBAC) middleware
 * @param  {...string} allowedRoles - List of roles permitted to access the route
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No authenticated user session found.',
      });
    }

    const userRole = (req.user.role || '').toString().toLowerCase().trim().replace(/[-_]/g, ' ');
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase().trim().replace(/[-_]/g, ' '));

    // Super Admin / Admin has bypass permissions across the entire platform
    if (userRole === 'super admin' || userRole === 'superadmin' || userRole === 'admin') {
      return next();
    }

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your role (${req.user.role}) is not authorized for this resource. Required: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
};

module.exports = {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  generateTokens,
  authenticateToken,
  optionalAuth,
  authorizeRoles,
};
