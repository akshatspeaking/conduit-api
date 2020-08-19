var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    article: {
      type: Schema.Types.ObjectId,
      required: [true, "ArticleId must be valid"],
      ref: "Article",
    },
    body: String,
    author: {
      type: Schema.Types.ObjectId,
      required: [true, "Every comment must have an author"],
      ref: "User",
    },
  },
  { timestamps: true }
);

commentSchema.methods.returnSingleComment = function (user) {
  return {
    comment: {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      body: this.body,
      author: {
        username: this.author.username,
        bio: this.author.bio,
        image: this.author.image,
        following: !user
          ? false
          : this.author.followers.includes(user.id)
          ? true
          : false,
      },
    },
  };
};

module.exports = mongoose.model("Comment", commentSchema);
