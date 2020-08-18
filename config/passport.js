var passport = require("passport");
var mongoose = require("./mongoose");
var User = mongoose.models.User;
var LocalStrategy = require("passport-local").Strategy;
// var JWTstrategy = require("passport-jwt").Strategy;
// var ExtractJWT = require("passport-jwt").ExtractJwt;

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          //Validate password and make sure it matches with the corresponding hash stored in the database
          //If the passwords match, it returns a value of true.
          const validate = user.verifyPassword(password);
          if (!validate) {
            return done(null, false, { message: "Wrong Password" });
          }
          return done(null, user, { message: "Logged in Successfully" });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
