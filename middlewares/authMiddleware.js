const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // Get the authorization header from the request
  const authHeader = req.headers["authorization"];

  // Extract the token from the header
  const token = authHeader && authHeader.split(" ")[1];

  // If no token is found, return an error
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the user id to the request object
    req.userId = decodedToken.userId;

    // Call the next middleware function
    next();
  } catch (err) {
    // If token is invalid, return an error
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
