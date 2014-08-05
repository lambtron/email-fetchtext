'use strict';

(function() {
  var mandrill = require('mandrill-api/mandrill');
  var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
  var _ = require('underscore');
  var EMAIL_ADDRESS = process.env.MANDRILL_EMAIL_ADDRESS;
  var DOMAIN = process.env.DOMAIN;

  module.exports = {
    send: function send (emails, subject, body, cb) {
      body += '\n\n\n\nForward or cc any link-containing emails to '
        + EMAIL_ADDRESS
        + ' and receive an email with the main text extracted. Learn more at '
        + DOMAIN;
      var message = {
        text: body,
        to: emails, // [{ 'email': 'andyjiang@gmail.com' }, { ... }]
        from_email: EMAIL_ADDRESS,
        subject: subject
      };

      mandrill_client.messages.send({
        "message": message
      }, cb, function (e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      });
    },

    removeNonEmails: function removeNonEmails (emailArray) {
      emailArray = _.compact(_.uniq(emailArray));
      for (var i = 0; i < emailArray.length; i++) {
        var emailAddress = emailArray[i].toLowerCase();
        if (emailAddress.indexOf('@') < 0 || emailAddress == EMAIL_ADDRESS) {
          emailArray[i] = '';
        } else {
          emailArray[i] = {
            email: emailAddress
          };
        }
      }
      return _.compact(emailArray);
    }
  };
}());
