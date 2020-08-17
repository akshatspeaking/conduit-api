var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: String,
    description: String,
    content: String,
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    favBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tags: [String],
  },
  { timestamps: true }
);

articleSchema.methods.returnSingleArticle = function (user) {};

module.exports = mongoose.model("Article", articleSchema);
