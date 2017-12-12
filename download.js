'use strict';

exports.downloadHandler = (event, context, callback) => {
  let hibiki = require('./hibiki');
  let s3 = require('./s3');
  let execSync = require('child_process').execSync;

  return new Promise((resolve, reject) => {
    var serial;
    hibiki.get_program_info()
      .then((res) => {
        let video_id = res.episode.video.id;
        serial = res.episode.name.match(/([\d\.]+)/)[0];
        return hibiki.get_playlist_url(video_id);
      })
      .then((res) => {
        let playlist_url = res.playlist_url;
        return hibiki.get_m3u8(playlist_url);
      })
      .then((res) => {
        let tmp_path = `/tmp/llss${serial}.mp4`;

        // /var/task/binにPATHをとおす
        process.env.PATH = process.env.PATH + ':/var/task/bin';
        console.log(process.env.PATH);

        let cmd = `ffmpeg -y -i '${res.playlist_url}' -vcodec copy -acodec copy -bsf:a aac_adtstoasc -loglevel debug ${tmp_path}`;
        execSync(cmd);
        return s3.put(tmp_path, serial);
      })
      .then(() => { resolve(); })
      .catch((err) => {
        reject(err);
      });
  });

}
