const mongodb = require('mongodb');
//const redis = require('redis');

class MongoDB {
   constructor() {
     this.mongoClient = mongodb.MongoClient;
     this.ObjectID = mongodb.ObjectID;
   }

  onConnect() {
    return new Promise((resolve, reject) => {     
      this.mongoClient.connect(
        'mongodb+srv://newnormuser:9527%263N1EDB@cluster0.ywi2p.mongodb.net/newnormtest?retryWrites=true&w=majority', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        (err, client) => {
          if (err) {
            reject(err);
          } else {
            resolve([client.db('newnormtest'), this.ObjectID, client]);
          }
        },
      );
    });
  }

}
module.exports = new MongoDB();
//module.exports.redisClient = redis.createClient();
