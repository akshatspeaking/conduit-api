var mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/conduit", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Mongo Error", err);
  });

module.exports = mongoose;
