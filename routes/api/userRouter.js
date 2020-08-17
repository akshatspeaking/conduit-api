var express = require("express");
var router = express.Router();
var User = require("../../models/User");
var userController = require("../../controllers/userController");
var jwtAuth = require("../../middleware/jwt-auth");

/* View my profile */
router.get("/", jwtAuth.required, userController.viewMyProfile);
// user avlbl in req body thanks to auth middleware ? v^

// Update my profile
router.put("/", jwtAuth.required, userController.updateProfile);

// Register user
router.post("/", userController.registerUser);

// (async (req, res, next) => {
// try {
//   console.log(req.body);
//   const user = await User.create(req.body);
//   res.send(user);
// create jwt and send to user
// } catch {}
// });

// Login user
router.post("/login", userController.loginUser);

module.exports = router;
