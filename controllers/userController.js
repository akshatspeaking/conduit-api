const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/User");
var jwt = require("jsonwebtoken");

module.exports = {
  updateProfile: async (req, res) => {
    let user = await User.findByIdAndUpdate(req.user.id, req.body);
    res.json(user.returnAsUser(req.user.token));
  },
  viewMyProfile: (req, res) => {
    res.json(req.user.returnAsUser(req.user.token));
  },
  viewOtherProfile: async (req, res) => {
    let user = await User.findOne({ username: req.params.username });
    res.json(req.user.returnAsProfile(req.user));
  },
  followUser: async (req, res) => {
    let user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $push: { followers: [req.user.id] } }
    );
    let currUser = User.findByIdAndUpdate(req.user.id, {
      $push: { following: [req.params.id] },
    });
    req.user = currUser;
    res.json(user.returnAsProfile(req.user));
  },
  unfollowUser: async (req, res) => {
    let user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { followers: [req.user.id] } }
    );
    let currUser = User.findByIdAndUpdate(req.user.id, {
      $pull: { following: [req.params.id] },
    });
    req.user = currUser;
    res.json(user.returnAsProfile(req.user));
  },
  registerUser: async (req, res, next) => {
    try {
      console.log("registering ");
      let user = await User.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      });
      let token = jwt.sign(user.id, process.env.secret);
      let userJson = user.returnAsUser(token);
      res.json(userJson);
    } catch (error) {
      next(error);
    }
  },
  loginUser: (req, res) => {
    let token = jwt.sign(req.user.id, process.env.secret);
    let userJson = req.user.returnAsUser(token);
    res.json(userJson);
  },
};
