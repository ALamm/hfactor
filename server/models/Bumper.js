var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create User Schema
var Bumper = new Schema({
  authorID: String,
  authorName: String,
  title: String,
  imgUrl: String,
  date: { type: Date, default: Date.now},
  repostedby: { type : Array , "default" : [] },
  likeby: { type: Array, "default" : [] }
});

module.exports = mongoose.model('bumper', Bumper);
