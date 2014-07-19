'use strict';

(function () {
  var extractor = require('unfluff', 'en');
  var request = require('request');
  var async = require('async');
  var _ = require('underscore');
  var DOMAIN = process.env.DOMAIN;

  function findUrls (text) {
    var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;
    var regexToken = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;

    // Iterate through any URLs in the text.
    while ((matchArray = regexToken.exec(source)) !== null) {
      var token = matchArray[0];
      if (token.indexOf(DOMAIN) < 0)
        urlArray.push( token );
    }

    var urlArrayS = urlArray.join(', ');
    console.log('Links: ' + urlArrayS);
    return urlArray;
  }

  module.exports = {
    emailToText: function emailToText (body, cb) {
      var URLs = findUrls(body);

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