const AWS = require('aws-sdk');
const fs = require('fs');
const logger=require("../config/winston");

class AWSConfig {
   constructor() {
       // Enter copied or downloaded access ID and secret key here
        this.ID = process.env.ACCESS_KEY;
        this.SECRET = process.env.SECRET_KEY;
        // The name of the bucket that you have created
        this.BUCKET_NAME = process.env.BUCKET_NAME;
        this.REGION_NAME = process.env.REGION_NAME;

        this.s3 = new AWS.S3({
            accessKeyId: this.ID,
            secretAccessKey: this.SECRET,
            region:this.REGION_NAME
        });

        
   }
  
  createBucket() {
    return new Promise((resolve, reject) => {   

        s3.createBucket(params, function(err, data) {
            if (err)  reject(err);
            else resolve(data.Location); 
        });
       
    });
  }

  uploadFile(file, fileName){

    return new Promise((resolve, reject) => {  
         // Read content from the file
         const fileContent = fs.readFileSync(file);
    
         // Setting up S3 upload parameters
         const params = {
             Bucket: this.BUCKET_NAME,
             Key: fileName, // File name you want to save as in S3
             Body: fileContent,
             ACL: 'private'
         };
     
         // Uploading files to the bucket
         this.s3.upload(params, function(err, data) {
             if (err) {
                logger.error(err);
                reject(err);
             }
             else{
                resolve(data.Location); 
             }
             
         });

    });
     
  }

}
module.exports = new AWSConfig();
