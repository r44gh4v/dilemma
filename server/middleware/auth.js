import jwt from 'jsonwebtoken';

// Middleware to verify JWT token from cookies
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    console.log('Auth failed: No token in cookies');
    return res.status(401).json({ error: 'Access denied' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('CRITICAL: JWT_SECRET not found in environment');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth failed: Token verification error', err.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Optional authentication - allows unauthenticated access
export const optionalAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
};