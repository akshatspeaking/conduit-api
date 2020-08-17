var express = require("express");
var router = express.Router();
var articleRouter = require("./articleRouter");
var userRouter = require("./userRouter");
var profileRouter = require("./profileRouter");

router.use("/users", userRouter);
router.use("/user", userRouter);
router.use("/profile", profileRouter);
router.use("/articles", articleRouter);
// Get tags
router.get("/tags", () => {});

module.exports = router;
