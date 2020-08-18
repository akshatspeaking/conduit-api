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
  let tags = [];
  articles.forEach((article) => {
    article.taglist.forEach((tag) => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  res.send({
    tags: tags,
  });
});

module.exports = router;
