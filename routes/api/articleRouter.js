var express = require("express");
var router = express.Router();
var articleController = require("../../controllers/articleController");
var commentController = require("../../controllers/commentController");
var jwtAuth = require("../../middleware/jwt-auth");

/*
   FEED
*/

// Global feed
router.get("/", jwtAuth.optional, () => {});

// Following Feed
router.get("/feed", jwtAuth.required, () => {});

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
router.get("/:slug", articleController.readArticle);

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

// Update comment
router.put(
  "/:slug/comments/:cimmentId",
  jwtAuth.required,
  commentController.updateComment
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
