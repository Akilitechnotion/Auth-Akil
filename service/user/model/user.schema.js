const mongoose = require("mongoose");
const CC = require("../../../config/constant_collection");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  password: {
    type: String,
  },
  profile: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    default: "Male",
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  created_date: {
    type: Date,
    default: new Date(),
  },
  update_date: {
    type: Date,
    default: new Date(),
  },
  password_reset_token: {
    type: String,
  },
  token_id: {
    type: String,
  },
});

UserSchema.pre("save", function (next) {
  const user = this;
  var SALTING_ROUNDS = 6;
  if (!user.isModified || !user.isNew) {
    next();
  } else {
    bcrypt.hash(user.password, SALTING_ROUNDS, function (err, hash) {
      if (err) {
        next(err);
      } else {
        user.password = hash;
        next();
      }
    });
  }
});

const UserModel = mongoose.model(CC.U001_USERS, UserSchema);
module.exports = UserModel;
