var mongoose = require('mongoose');


var ObsSchema = new mongoose.Schema({
  obs_Analysisid: String,
  category: String,
  subcategory: String,
  observation: String,
  risk: String
  
});


module.exports = mongoose.model('Obs', ObsSchema,'observation');