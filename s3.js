'use strict';

let AWS = require('aws-sdk');

let s3 = {};

s3.find = () => {
  return new Promise((resolve, reject) => {
    let s3 = new AWS.S3();
    let params = {
      Bucket: process.env.BUCKET_NAME,
      Prefix: 'llss'
    };

    console.log("############ list objects ###############");

    s3.listObjectsV2(params, (err, data) => {
      if(err) {
        reject(err);
      } else {
        let key = data.Contents.sort((a, b) => {
          return (a.Key > b.Key) ? -1 : 1;
        })[0].Key;
        resolve(key);
      }
    });
  });
};

s3.get_signed_url = (key) => {
  return new Promise((resolve, reject) => {
    let s3 = new AWS.S3();
    var params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Expires: 60 * 60
    };
    console.log("############ signed url ###############");
    s3.getSignedUrl('getObject', params, (err, url) => {
      if(err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
};

s3.put = (tmp_path, serial) => {
  return new Promise((resolve, reject) => {
    let s3 = new AWS.S3();
    let fs = require('fs');
    
    let params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `llss${serial}.mp4`,
      Body: fs.readFileSync(tmp_path)
    };
    s3.putObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = s3;
