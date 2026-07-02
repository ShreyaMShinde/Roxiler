const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_cafe_ratings_jwt_secret_key_123');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }

    const rolesArray = Array.isArray(roles) ? roles : [roles];
    
    if (!rolesArray.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden. You do not have the required role.' });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
};
