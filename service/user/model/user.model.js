"use strict";
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const UserSchema = require("./user.schema");

class UserModel {
  constructor() {
    this.DB = require("../../../config/dbm");
    this.projectedKeys = {
      crtd_dt: true,
    };
  }

  userRegister(request) {
    let register_user = new UserSchema(request);

    return new Promise(async (resolve, reject) => {
      try {
        const result = await register_user.save();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  findUserById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await UserSchema.find({ _id: ObjectId(id), is_deleted: false });
        resolve(result);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  findUserByEmail(email) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await UserSchema.find({ email: email, is_deleted: false });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  findUserByMobile(mobile) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await UserSchema.find({ mobile: mobile, is_deleted: false });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateToken(user_id, token) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await UserSchema.updateMany(
          { _id: ObjectId(user_id) },
          {
            $set: {
              token_id: token,
            },
          }
        );
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  resetTokenSave(email, token) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await UserSchema.updateOne(
          { email: email },
          {
            $set: {
              password_reset_token: token,
            },
          }
        );
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  findUserByToken(token) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await UserSchema.find({ password_reset_token: token, is_deleted: false });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  userUpdatePassword(id, password) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await UserSchema.updateMany(
          { _id: ObjectId(id) },
          {
            $set: {
              password: password,
            },
          }
        );
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
}
module.exports = new UserModel();
