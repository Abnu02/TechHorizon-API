const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
};

module.exports = { generateToken };
