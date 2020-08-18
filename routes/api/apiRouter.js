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
  let articles = await Article.find();
  let tagsToSend = [];
  articles.forEach((article) => {
    article.tagList.forEach((tag) => {
      if (!tagsToSend.includes(tag)) {
        tagsToSend.push(tag);
      }
    });
  });
  res.send({
    tags: tagsToSend,
  });
});

module.exports = router;
