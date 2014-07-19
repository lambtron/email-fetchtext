'use strict';

(function() {

  /**
   * Import helpers ============================================================
   */
  var Mandrill = require('../app/helpers/mandrill');
  var Unfluff = require('../app/helpers/unfluff');
  var _ = require('underscore');
  var DOMAIN = process.env.DOMAIN;

  // Private functions. ========================================================
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

    return urlArray;
  }

  // Public functions. =========================================================
  module.exports = function (app) {
    // API endpoints ===========================================================
    app.post('/inbound', function (req, res) {
      var blob = req.body;
      blob = JSON.parse(blob.mandrill_events);

      // Body will be an array.
      var body = blob[0].msg.text;
      var subject = blob[0].msg.subject;

      // Get URLs.
      var URLs = findUrls(body);

      // Get email addresses in array.
      var emails = [];
      emails.push(blob[0].msg.from_email);
      emails.push(blob[0].msg.to);
      emails.push(blob[0].msg.cc);
      emails = Mandrill.removeNonEmails(_.flatten(emails));

      // Logging.
      console.log('\n\n');
      console.log('###################### NEW EMAIL ######################');
      console.log('Subject: ' + subject);
      console.log('Emails:');
      console.log(emails);
      console.log(URLs.join(', '));

      var sendEmail = function sendEmail (err, res) {
        var body = res.join(' ');
        if (body.indexOf('@andyjiang') >= 0) {
          console.log('Unfluff had trouble parsing the link.');
        }
        Mandrill.send(emails, subject, res.join(' '), function (res) {
          console.log('Email sent!');
        });
      };

      Unfluff.emailToText(URLs, sendEmail);

      res.send(200);
    });

  	// Application routes ======================================================
  	app.get('/*', function (req, res) {
      res.sendfile('index.html', {'root': './public/views/'});
    });
  };

}());