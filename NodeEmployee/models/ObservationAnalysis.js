var mongoose = require('mongoose');


var ObservationAnalysisSchema = new mongoose.Schema({
  obs_Analysisid: String,
  job_catid: String,
  jobcategory: String,
  job_typeid: String,
  jobtype: String,
  vessel_id: String,
  vessel: String,
  company_id: String,
  company: String,
  reviewdate: Date,
  nonationality: String,
  country: String,
  city: String,
  nationality: [String],
  status: String
});


module.exports = mongoose.model('ObservationAnalysis', ObservationAnalysisSchema,'observationanalysis');