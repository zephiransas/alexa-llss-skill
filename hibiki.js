'use strict';

let setting = require('./setting.json');
let request = require('request');
let hibiki = {};

hibiki.get_program_info = () =>  {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'GET',
      url: setting.program_url,
      headers: setting.headers,
      json: true
    };

    request(options, (err, res, body) => {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

hibiki.get_playlist_url = (video_id) => {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'GET',
      url: setting.play_check_url,
      headers: setting.headers,
      qs: { video_id: video_id },
      json: true
    };

    request(options, (err, res, body) => {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

hibiki.get_m3u8 = (url) => {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'GET',
      url: url,
      headers: setting.headers
    };

    request(options, (err, res, body) => {
      if(err) {
        reject(err);
      } else {
        resolve({
          playlist_url: url
        });
      }
    });
  });
}

module.exports = hibiki;
