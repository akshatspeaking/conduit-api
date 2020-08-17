var express = require("express");
var router = express.Router();
var articleController = require("../../controllers/articleController");
var commentController = require("../../controllers/commentController");
/*
   FEED
*/

// Global feed
router.get("/", () => {});

// Following Feed
router.get("/feed", () => {});

/*
   ARTICLES
*/

// Create new article
router.post("/", articleController.createArticle);

// Update article
router.put("/:slug", articleController.updateArticle);

// Delete article
router.delete("/:slug", articleController.deleteArticle);

// Read article
router.get("/:slug", articleController.readArticle);

// Favorite article
router.post("/:slug/favorite", articleController.favoriteArticle);

// Unfoavorite article
router.delete("/:slug/favorite", articleController.unfavoriteArticle);

/*
   COMMENTS
*/

// Add comment
router.post("/:slug/comments", commentController.createComment);

// Update comment
router.put("/:slug/comments/:cimmentId", commentController.updateComment);

// Delete comment
router.delete("/:slug/comments/:commentId", commentController.deleteComment);

// Read all comments
router.get("/:slug/comments", commentController.readAllComments);

module.exports = router;
