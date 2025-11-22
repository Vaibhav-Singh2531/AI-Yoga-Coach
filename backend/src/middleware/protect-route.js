const jwt = require('jsonwebtoken');

const protectRoute = (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // 3️⃣ Attach userId to request object
    req.userId = decoded.userId;
    console.log(req.userId);

    // 4️⃣ Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

module.exports = { protectRoute };
