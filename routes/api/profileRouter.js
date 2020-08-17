var express = require("express");
var router = express.Router();
var userController = require("../../controllers/userController");

// View Other Profile
router.get("/:username", userController.viewOtherProfile);

// Follow User
router.get("/:username/follow", userController.followUser);

// Unfollow user
router.get("/:username/unfollow", userController.unfollowUser);

module.exports = router;
