const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = (id) => {
  return jwt.sign({ id }, keys.JWT_SECRET, {
    expiresIn: "30d",
  });
};
