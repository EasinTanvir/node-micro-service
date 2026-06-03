const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  let token;

  try {
    token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Token Required",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.user = { id: decodedToken.userId };
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token Check Failed",
    });
  }
};
