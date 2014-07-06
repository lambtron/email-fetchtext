var request = require('request');
var async = require('async');
var extractor = require('unfluff', 'en');

var URLs = ['http://www.polygon.com/2014/6/26/5842180/shovel-knight-review-pc-3ds-wii-u', 'http://blog.ycombinator.com/make-things-and-show-them'];

var getText = function getText (url, callback) {
  request.get(url, function (err, res, body) {
    var data = extractor(body);
    return callback(null, data.text);
  });
};

var sendEmail = function sendEmail (err, res) {
  console.log(res);
};

async.map(URLs, getText, sendEmail);