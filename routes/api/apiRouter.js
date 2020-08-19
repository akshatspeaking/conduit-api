var express = require("express");
var router = express.Router();
var articleRouter = require("./articleRouter");
var userRouter = require("./userRouter");
var profileRouter = require("./profileRouter");
const Article = require("../../models/Article");

router.use("/users", userRouter);
router.use("/user", userRouter);
router.use("/profiles", profileRouter);
router.use("/articles", articleRouter);
// Get tags
router.get("/tags", async (req, res, next) => {
  let tagsToSend = await Article.distinct("tagList");
  console.log(tagsToSend);

  res.send({
    tags: tagsToSend,
  });
});

module.exports = router;
