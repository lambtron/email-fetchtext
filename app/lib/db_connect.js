// Connect to database.
var mongoose = require('mongoose')
  , database = require('../../config/database');
mongoose.connect(database.url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Mongoose is running');
});