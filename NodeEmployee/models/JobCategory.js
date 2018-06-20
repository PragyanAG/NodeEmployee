var mongoose = require('mongoose');


var JobCategorySchema = new mongoose.Schema({
  
  jobcategory: String,
  status: String,
  });


module.exports = mongoose.model('JobCategory', JobCategorySchema,'jobcategorys');