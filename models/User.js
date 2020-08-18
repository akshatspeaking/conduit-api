var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

function handleErrors(err) {
  console.log(err.message, err.code);

  let error = {
    email: "",
    username: "",
    password: "",
  };

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }

  return errors;
}

var userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username already exists"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already registered"],
    },
    password: {
      required: [true, "Please include a password"],
      type: String,
      minlength: [6, "Password must be at least 6 chars long"],
    },
    bio: String,
    avatar: String,
    articles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  // .this points to object that is going to be saved to mongodb along with _id and timestamps
  // cannot use arrow functions with hooks as they have no .this
  if (this.password) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

userSchema.methods.verifyPassword = function (plainpwd) {
  return bcrypt.compareSync(plainpwd, this.password);
};

userSchema.methods.returnAsProfile = function (user) {
  return {
    profile: {
      username: this.username,
      bio: this.bio,
      image: this.avatar,
      following: this.followers.includes(user.id) ? true : false,
    },
  };
};

userSchema.methods.returnAsUser = function (token) {
  return {
    user: {
      username: this.username,
      email: this.email,
      token: token,
      bio: this.bio,
      image: this.avatar,
    },
  };
};

module.exports = mongoose.model("User", userSchema);
