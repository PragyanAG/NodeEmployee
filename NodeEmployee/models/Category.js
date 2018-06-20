var mongoose = require('mongoose');


var CategorySchema = new mongoose.Schema({
  
  category: String
  });


module.exports = mongoose.model('Category', CategorySchema,'categorys');