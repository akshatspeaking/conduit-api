var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var connection = require("./mongoose");
var User = mongoose.models.User;

async function verifyCallback(username, password, done) => {

}