const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ message: "Unauthorized" });

  const token = req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error(`Error token validation`);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
