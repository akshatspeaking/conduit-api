var mongoose = require("mongoose");
var slugify = require("slugify");
var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    title: String,
    description: String,
    body: String,
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    favBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tagList: [String],
  },
  { timestamps: true }
);

articleSchema.methods.returnSingleArticle = function (user) {
  return {
    article: {
      slug: this.slug,
      title: this.title,
      description: this.description,
      body: this.body,
      taglist: this.tagList,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      favorited: !user ? false : this.favBy.includes(user.id) ? true : false,
      favoritesCount: this.favBy.length,
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

articleSchema.pre("save", function (next) {
  this.slug = slugify(this.title);
  next();
});

module.exports = mongoose.model("Article", articleSchema);
