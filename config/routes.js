'use strict';

(function() {

  /**
   * Import helpers ============================================================
   */
  var Mandrill = require('../app/helpers/mandrill');
  var Unfluff = require('../app/helpers/unfluff');
  var _ = require('underscore');

  // Public functions. =========================================================
  module.exports = function (app) {
    // API endpoints ===========================================================
    app.post('/inbound', function (req, res) {
      var blob = req.body;
      blob = JSON.parse(blob.mandrill_events);

      // body will be an array.
      var body = blob[0].msg.text;
      var subject = blob[0].msg.subject;

      // get email addresses in array.
      var emails = [];
      emails.push(blob[0].msg.from_email);
      emails.push(blob[0].msg.to);
      emails.push(blob[0].msg.cc);
      emails = Mandrill.removeNonEmails(_.flatten(emails));

      var sendEmail = function sendEmail (err, res) {
        console.log('\n\n');
        console.log('###################### NEW EMAIL ######################');
        console.log('Subject: ' + subject);
        var emailsS = emails.join(', ');
        console.log('Emails: ' + emailsS);

        Mandrill.send(emails, subject, res.join(' '), function (res) {
          console.log('Email sent!');
        });
      };

      Unfluff.emailToText(body, sendEmail);

      res.send(200);
    });

  	// Application routes ======================================================
  	app.get('/*', function (req, res) {
      res.sendfile('index.html', {'root': './public/views/'});
    });
  };

}());