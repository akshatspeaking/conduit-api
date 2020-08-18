var Article = require("../models/Article");
var Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res, next) => {
    try {
      let art = await Article.findOne({ slug: req.params.slug });

      req.body.comment.author = req.user.id;
      let comment = await (await Comment.create(req.body.comment)).execPopulate(
        "author"
      );
      comment.article = art.id;
      let article = await Article.findOneAndUpdate(
        { slug: req.params.slug },
        { push: { comments: comment.id } },
        { new: true }
      );
      res.json(comment.returnSingleComment(req.user));
    } catch (error) {
      next(error);
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      let toEdit = await Comment.findById(req.params.commentid);
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
      let article = await Article.findOne({ slug: req.params.slug });
      let commentsPopulated = await Comment.find({
        article: article.id,
      }).populate("author");
      let commentsToReturn = [];
      commentsPopulated.forEach((comment) => {
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
