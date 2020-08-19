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
            req.body.article,
            { new: true }
          )
        ).execPopulate("author");
        res.json(article.returnSingleArticle(req.user));
      } else {
        res
          .status(403)
          .json({ error: "You are not authorized to perform this action" });
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
        res
          .status(403)
          .json({ error: "You are not authorized to perform this action" });
      }
    } catch (error) {
      next(error);
    }
  },
  readArticle: async (req, res) => {
    try {
      let article = await (
        await Article.findOne({ slug: req.params.slug })
      ).execPopulate("author");
      res.json(article.returnSingleArticle(req.user));
    } catch (error) {
      next(error);
    }
  },
  favoriteArticle: async (req, res) => {
    try {
      let check = await Article.findOne({ slug: req.params.slug });
      if (check.favorited.includes(req.user.id)) {
        return res
          .status(422)
          .json({ error: "You have already favorited this article" });
      }

      let article = await Article.findOneAndUpdate(
        { slug: req.params.slug },
        { $push: { favorited: req.user.id } },
        { new: true }
      );
      let currUser = User.findByIdAndUpdate(
        req.user.id,
        {
          $push: { favorites: article.id },
        },
        { new: true }
      );
      currUser.token = req.user.token;
      req.user = currUser;
      let articleToReturn = await (
        await Article.findById(article.id)
      ).execPopulate("author");
      res.json(articleToReturn.returnSingleArticle(req.user));
    } catch (error) {
      next(error);
    }
  },

  unfavoriteArticle: async (req, res) => {
    try {
      let check = await Article.findOne({ slug: req.params.slug });
      if (!check.favorited.includes(req.user.id)) {
        return res
          .status(422)
          .json({ error: "You have already unfavorited this article" });
      }

      let article = await Article.findOneAndUpdate(
        { slug: req.params.slug },
        { $pull: { favorited: req.user.id } },
        { new: true }
      );
      let currUser = User.findByIdAndUpdate(
        req.user.id,
        {
          $pull: { favorites: article.id },
        },
        { new: true }
      );
      currUser.token = req.user.token;
      req.user = currUser;
      let articleToReturn = await (
        await Article.findById(article.id)
      ).execPopulate("author");
      res.json(articleToReturn.returnSingleArticle(req.user));
    } catch (error) {
      next(error);
    }
  },
};
