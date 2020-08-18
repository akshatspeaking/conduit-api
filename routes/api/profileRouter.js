var express = require("express");
var router = express.Router();
var userController = require("../../controllers/userController");
var jwtAuth = require("../../middleware/jwt-auth");

// Follow User
router.post("/:username/follow", jwtAuth.required, userController.followUser);

// Unfollow user
router.get(
  "/:username/unfollow",
  jwtAuth.required,
  userController.unfollowUser
);

// View Other Profile
router.get("/:username", jwtAuth.optional, userController.viewOtherProfile);

module.exports = router;
