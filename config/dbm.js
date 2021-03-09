const mongoose = require("mongoose");
require("dotenv").config();

//const redis = require('redis');

class MongoDB {
  constructor() {
    this.mongoClient = mongoose;
    this.ObjectID = mongoose.ObjectID;
    this.onConnect();
  }

  onConnect() {
    return new Promise((resolve, reject) => {
      //Set up default mongoose connection
      mongoose.connect(
        process.env.MONGODB_DB_URL,
        mongoose.connection.on("error", function (err) {
          reject(err);
        })
      );
      mongoose.connection.on("connected", function () {
        resolve(mongoose.connection);
      });
    });
  }
}
module.exports = new MongoDB();
//module.exports.redisClient = redis.createClient();
