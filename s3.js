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
        let value = data.Contents.sort((a, b) => {
          return (a.Key > b.Key) ? -1 : 1;
        })[0];

        if(value == undefined) {
          resolve(null);
        } else {
          resolve(value.Key);
        }
      }
    });
  });
};

s3.is_exist = (serial) => {
  return new Promise((resolve, reject) => {
    s3.find().then((key) => {
      let file = `llss${serial}.mp4`;
      if(key == file) {
        reject(`${file} is already exists`);
      } else {
        resolve();
      }
    })
  });
}

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
        console.log(url);
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

s3.save_program_info = (body) => {
  let s3 = new AWS.S3();
  let params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `program.json`,
    Body: body
  };
  s3.putObject(params, (err, data) => {
    if(err) {
      console.log("Fail to save program info: " + err);
    } else {
      console.log("save program info");
    }
  });
}

s3.read_json = () => {
  return new Promise((resolve, reject) => {
    let s3 = new AWS.S3();
    let params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `program.json`
    };

    s3.getObject(params, (err, data) => {
      if(err) {
        reject(err);
      } else {
        resolve(JSON.parse(data.Body.toString()));
      }
    });
  })
}

module.exports = s3;
