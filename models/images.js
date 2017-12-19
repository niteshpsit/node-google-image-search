// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var imageSchema = new Schema({
  word: { type: String, required: true },
  imageList: [{ type: String }],
});

// the schema is useless so far
// we need to create a model using it
var Image = mongoose.model('User', imageSchema);

// make this available to our users in our Node applications
module.exports = Image;
