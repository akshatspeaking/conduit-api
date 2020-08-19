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
  try {
    let limit = Number(req.query.limit) || 20;
    let offset = Number(req.query.offset) || 0;

    let queries = ["author", "tags", "favorited"];
    let opts = {};
    queries.forEach(async (q) => {
      if (req.query[q]) {
        if (q == "favorited") {
          let u = await User.findOne({ username: req.query.favorited });
          let id = u.id;
          opts[q] = id;
        } else {
          opts[q] = req.query[q];
        }
      }
    });
    console.log(opts);
    let articles = await Article.find(opts)
      .sort({
        createdAt: -1,
      })
      .skip(offset)
      .limit(limit)
      .populate("author", "email name followers");
    var toReturn = [];
    console.log(articles);

    articles.forEach(async (article) => {
      let populatedArticle = await article.execPopulate("author");
      toReturn.push(populatedArticle.returnSingleArticle(req.user).article);
    });
    res.json({
      articles: toReturn,
      articlesCount: toReturn.length,
    });
  } catch (error) {
    next(error);
  }
});

// Following Feed
router.get("/feed", jwtAuth.required, async (req, res, next) => {
  try {
    let limit = Number(req.query.limit) || 20;
    let offset = Number(req.query.offset) || 0;

    let articles = await Article.find({
      author: { $in: req.user.following },
    })
      .populate("author")
      .sort({
        createdAt: -1,
      })
      .skip(offset)
      .limit(limit);

    let toReturn = [];

    articles.forEach((article) => {
      toReturn.push(article.returnSingleArticle(req.user).article);
    });

    res.json({
      articles: toReturn,
      articlesCount: toReturn.length,
    });
  } catch (error) {
    next(error);
  }
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
  "/:slug/comments/:commentid",
  jwtAuth.required,
  commentController.deleteComment
);

// Read all comments
router.get("/:slug/comments", commentController.readAllComments);

module.exports = router;
