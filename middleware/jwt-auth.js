var jwt = require("jsonwebtoken");

exports.generateToken = async (user) => {
  var payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
  };
  var token = await jwt.sign(payload, "randomsecret");
  return token;
};

exports.verifyToken = async (user) => {};

exports.verifyUser = (req, res, next) => {};

exports.loginUser = (req, res, next) => {};
