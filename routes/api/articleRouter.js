var express = require("express");
var router = express.Router();
var articleController = require("../../controllers/articleController");
var commentController = require("../../controllers/commentController");
var jwtAuth = require("../../middleware/jwt-auth");
var Article = require("../../models/Article");
var User = require("../../models/User");
/*
   FEED
*/

// Global feed
router.get("/", jwtAuth.optional, async (req, res, next) => {
  let articles = await Article.find({
    author: req.query.author || "",
    tagList: { $in: [req.query.tag || ""] },
    favBy: { $in: [req.query.favorited || ""] },
  })
    .sort({
      createdAt: -1,
    })
    .skip(req.query.offset || 0)
    .limit(req.query.limit || 20);
  let toReturn = [];
  articles.forEach(async (article) => {
    let populated = await article.execPopulate("author");
    toReturn.push(populated.returnSingleArticle(req.user).article);
    res.json({
      articles: toReturn,
      articlesCount: toReturn.length,
    });
  });
});

// Following Feed
router.get("/feed", jwtAuth.required, async (req, res, next) => {
  let x = await Article.find()
    .execPopulate({
      path: "author",
      populate: "followers",
    })
    .match(author.following);

  // let userNow = await (await User.findById(req.user.id)).execPopulate({
  //   path: "following",
  //   populate: "articles",
  // });
  // let toReturn = [];
  // userNow.following.forEach((author) => {
  //   author.articles.forEach((article) => {
  //     toReturn.push(article.returnSingleArticle(req.user).article);
  //   });
  // });
  // res.json({
  //   articles: toReturn,
  //   articlesCount: toReturn.length,
  // });
});

/*
   ARTICLES
*/

// Create new article
router.post("/", jwtAuth.required, articleController.createArticle);

// Update article
router.put("/:slug", jwtAuth.required, articleController.updateArticle);

// Delete article
router.delete("/:slug", jwtAuth.required, articleController.deleteArticle);

// Read article
router.get("/:slug", jwtAuth.optional, articleController.readArticle);

// Favorite article
router.post(
  "/:slug/favorite",
  jwtAuth.required,
  articleController.favoriteArticle
);

// Unfoavorite article
router.delete(
  "/:slug/favorite",
  jwtAuth.required,
  articleController.unfavoriteArticle
);

/*
   COMMENTS
*/

// Add comment
router.post(
  "/:slug/comments",
  jwtAuth.required,
  commentController.createComment
);

// Delete comment
router.delete(
  "/:slug/comments/:commentId",
  jwtAuth.required,
  commentController.deleteComment
);

// Read all comments
router.get("/:slug/comments", commentController.readAllComments);

module.exports = router;
