const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(403).send("Invalid token.");
  }
};

module.exports = { authenticateToken };
