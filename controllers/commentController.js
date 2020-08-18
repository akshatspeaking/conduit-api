var Article = require("../models/Article");
var Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res, next) => {
    try {
      req.body.comment.author = req.user.id;
      let comment = await (await Comment.create(req.body.comment)).execPopulate(
        "author"
      );
      res.json(comment.returnSingleComment(req.user));
    } catch (error) {
      next(error);
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      let toEdit = await Comment.findById(req.params.commendId);
      if (toEdit.author == req.user.id) {
        let comment = await Comment.findByIdAndDelete(req.params.commentId);
        res.send("Comment Deleted");
      } else {
        res.send("You are not the author of this comment");
      }
    } catch (error) {
      next(error);
    }
  },
  readAllComments: async (req, res, next) => {
    try {
      let toRead = await Article.findOne({ slug: req.params.slug });
      let commentsToReturn = [];
      toRead.comments.forEach((comment) => {
        commentsToReturn.push(comment.returnSingleComment(req.user).comment);
      });
      res.json({
        comments: commentsToReturn,
        commentsCount: commentsToReturn.length,
      });
    } catch (error) {
      next(error);
    }
  },
};
