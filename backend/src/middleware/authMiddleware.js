const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Check if the Authorization header is present
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // Split the header into type and token
  const [type, token] = authHeader.split(" ");

  // Validate the token type
  if (type !== "Bearer") {
    return res.status(401).json({ message: "Invalid token type" });
  }

  // Ensure the token is present
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  // Verify the token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken; // Attach the decoded token to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(`Token validation error: ${err.message}`);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
