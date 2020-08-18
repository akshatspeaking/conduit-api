var Article = require("../models/Article");
var User = require("../models/User");

module.exports = {
  createArticle: async (req, res, next) => {
    try {
      req.body.article.author = req.user.id;
      let article = await (await Article.create(req.body.article)).execPopulate(
        "author"
      );
      res.json(article.returnSingleArticle(req.user));
    } catch (error) {
      next(error);
    }
  },
  updateArticle: async (req, res, next) => {
    try {
      let toEdit = await Article.findOne({ slug: req.params.slug });
      if (toEdit.author == req.user.id) {
        let article = await (
          await Article.findOneAndUpdate(
            { slug: req.params.slug },
            req.body.article
          )
        ).execPopulate("author");
        res.json(article.returnSingleArticle(req.user));
      } else {
        res.send("You are not the author of this article");
      }
    } catch (error) {
      next(error);
    }
  },
  deleteArticle: async (req, res, next) => {
    try {
      let toEdit = await Article.findOne({ slug: req.params.slug });
      if (toEdit.author == req.user.id) {
        let article = await (
          await Article.findOneAndDelete({ slug: req.params.slug })
        ).execPopulate("author");
        res.send("Article Deleted");
      } else {
        res.send("You are not the author of this article");
      }
    } catch (error) {
      next(error);
    }
  },
  readArticle: async (req, res) => {
    let article = await (
      await Article.findOne({ slug: req.params.slug })
    ).execPopulate("author");
    // if (req.user) {
    res.json(article.returnSingleArticle(req.user));
    // }
  },
  favoriteArticle: async (req, res) => {
    let article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      { $push: { favBy: [req.user.id] } }
    );
    let currUser = User.findByIdAndUpdate(req.user.id, {
      $push: { favorites: [article.id] },
    });
    req.user = currUser;
    res.json(article.returnSingleArticle(req.user));
  },
  unfavoriteArticle: async (req, res) => {
    let article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      { $pull: { favBy: [req.user.id] } }
    );
    let currUser = User.findByIdAndUpdate(req.user.id, {
      $pull: { favorites: [article.id] },
    });
    req.user = currUser;
    res.json(article.returnSingleArticle(req.user));
  },
};
