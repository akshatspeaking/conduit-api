var passport = require("passport");
var mongoose = require("./mongoose");
var User = mongoose.models.User;

var JWTstrategy = require("passport-jwt").Strategy;
var ExtractJWT = require("passport-jwt").ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("Token"),
  secretOrKey: process.env.secret,
};

module.exports = {
  optional: () => {
    passport.use(
      "jwt",
      new JWTstrategy(opts, (jwt_payload, done) => {
        try {
          User.findOne({
            where: {
              username: jwt_payload.id,
            },
          }).then((user) => {
            if (user) {
              console.log("user found in db in passport");
              // note the return removed with passport JWT - add this return for passport local
              done(null, user);
            } else {
              console.log("user not found in db");
              done(null, false);
            }
          });
        } catch (err) {
          done(err);
        }
      })
    );
  },
  required: () => {
    passport.use(
      "jwt",
      new JWTstrategy(opts, (jwt_payload, done) => {
        try {
          User.findOne({
            where: {
              username: jwt_payload.id,
            },
          }).then((user) => {
            if (user) {
              console.log("user found in db in passport");
              // note the return removed with passport JWT - add this return for passport local
              done(null, user);
            } else {
              console.log("user not found in db");
              done("Please log in to continue!");
            }
          });
        } catch (err) {
          done(err);
        }
      })
    );
  },
};
