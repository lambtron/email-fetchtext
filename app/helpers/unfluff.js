'use strict';

(function () {
  var extractor = require('unfluff', 'en');
  var request = require('request');
  var async = require('async');
  var _ = require('underscore');
  var DOMAIN = process.env.DOMAIN;

  module.exports = {
    emailToText: function emailToText (URLs, cb) {
      var getText = function getText (url, cb) {
        request.get(url, function (err, res, body) {
          var data = {
            title: '',
            text: ''
          };
          var text = '';

          if (body && typeof body == "string")
            data = extractor(body);
          text = data.title + '\n\n' + data.text;

          if (data.canonicalLink)
            text += '\n\nLink: ' + data.canonicalLink;

          if (data.text.length == 0) {
            text = 'Apologies, error parsing the link. Direct all hate tweets'
              + ' to @andyjiang.';
          }
          return cb(null, text);
        });
      };

      async.map(URLs, getText, cb);
    }
  };

}());