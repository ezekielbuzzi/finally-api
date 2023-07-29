const jwt = require("jsonwebtoken");
const User = require("../models/User");
const keys = require("../config/keys");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, keys.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      console.log(user);
    } catch (error) {
      res.status(401).json({
        status: "fail",
        message: "Not authorized",
      });
    }
    next();
  } else {
    res.status(401).json({
      status: "fail",
      message: "Not authorized, no token is provided",
    });
  }
};

module.exports = protect;
