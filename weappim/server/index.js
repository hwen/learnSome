const fs = require('fs');
const express = require('express');
const multer = require('multer');
const md5 = require('md5');
const m3Duration = require('mp3-duration');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  res.send('hallo world~');
});

app.post('/upload/img', upload.single('img'), function(req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log('===== uploading img ======');
  console.log(req.file);
  console.log(req.body);
  fs.readFile(req.file.path, (err, data) => {
    if (err) throw err;
    fs.unlinkSync(req.file.path);
    console.log(data);
    // res.send(data.toString('base64'));
    // res.json({
    //   base64Str: data.toString('base64'),
    //   totalSize: req.file.size,
    //   md5: md5(data)
    // });
    res.send({
      base64Str: data.toString('base64'),
      totalSize: req.file.size,
      length: data.length,
      bl: data.byteLength,
      md5: md5(data)
    });
  });
});

app.post('/upload/sound', upload.single('sound'), function(req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log('===== uploading sound ======');
  console.log(req.file);
  console.log(req.body);
  fs.readFile(req.file.path, (err, data) => {
    if (err) throw err;
    fs.unlinkSync(req.file.path);
    console.log(data);
    m3Duration(data, (err, duration) => {
      if (err) return console.log(err.message);
      console.log('Your file is ' + duration + ' seconds long');
      res.json({
        base64Str: data.toString('base64'),
        totalSize: req.file.size,
        length: data.length,
        duration: duration,
        bl: data.byteLength,
        md5: md5(data)
      });
    });
  });
});

app.listen(2333, () => {
  console.log('Express server listening on 2333');
});
