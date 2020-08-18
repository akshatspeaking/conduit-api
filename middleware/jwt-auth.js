var User = require("../models/User");
var jwt = require("jsonwebtoken");

module.exports = {
  optional: async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        var decoded = jwt.verify(
          req.headers.authorization.split(" ")[1],
          process.env.secret
        );
        let user = await User.findById(decoded);
        if (user) {
          console.log("logged in - continuing");
          req.user = user;
          req.user.token = req.headers.authorization.split(" ")[1];
          return next();
        } else {
          console.log("NOT logged in - continuing");
          req.user = null;
          return next();
        }
      } else {
        console.log("NOT logged in - continuing");
        req.user = null;
        return next();
      }
    } catch (error) {
      next(error);
    }
  },
  required: async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        var decoded = jwt.verify(
          req.headers.authorization.split(" ")[1],
          process.env.secret
        );
        let user = await User.findById(decoded);
        if (user) {
          console.log("logged in - continuing");

          req.user = user;
          req.user.token = req.headers.authorization.split(" ")[1];
          return next();
        } else {
          console.log("NOT logged in - not continuing");
          req.user = null;
          res.send("UNAUTHORIZED");
        }
      } else {
        console.log("NOT logged in - not continuing");
        req.user = null;
        res.send("UNAUTHORIZED");
      }
    } catch (error) {
      next(error);
    }
  },
};
