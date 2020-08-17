var express = require("express");
var router = express.Router();
var User = require("../../models/User");
var userController = require("../../controllers/userController");

/* View my profile */
router.get("/", userController.viewMyProfile);
// user avlbl in req body thanks to auth middleware ? v^

// Update my profile
router.put("/", userController.updateProfile);

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
router.post("/login", async (req, res, next) => {
  try {
    // get login data from req body
    const user = await User.findOne({});
    // if user, generate and set jwt
    // next
  } catch {}
});

module.exports = router;
