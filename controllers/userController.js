const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../models/User");

module.exports = {
  updateProfile: (req, res) => {},
  viewMyProfile: (req, res) => {},
  viewOtherProfile: (req, res) => {},
  followUser: (req, res) => {},
  unfollowUser: (req, res) => {},
  registerUser: (req, res) => {
    passport.use(
      "signup",
      new localStrategy(
        {
          usernameField: "username",
          emailField: "email",
          passwordField: "password",
          session: false,
        },
        async (email, username, password, done) => {
          try {
            const user = await UserModel.create({ email, username, password });
            return done(null, user);
          } catch (error) {
            done(error);
          }
        }
      )
    );
  },
  loginUser: (req, res) => {
    passport.use(
      "login",
      new localStrategy(
        {
          usernameField: "email",
          passwordField: "password",
        },
        async (email, password, done) => {
          try {
            const user = await UserModel.findOne({ email });
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
  },
};
