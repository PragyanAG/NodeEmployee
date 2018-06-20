var mongoose = require('mongoose');


var SubCategorySchema = new mongoose.Schema({
  category: String,
  category_id: String,
  subcategory: String
});


module.exports = mongoose.model('SubCategory', SubCategorySchema,'subcategorys');