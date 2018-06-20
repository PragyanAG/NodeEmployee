var mongoose = require('mongoose');


var JobTypeSchema = new mongoose.Schema({
  jobcategory: String,
  jobcategory_id: String,
  jobtype: String,
  jobdescription: String,
  status: String
});


module.exports = mongoose.model('JobType', JobTypeSchema,'jobtypes');