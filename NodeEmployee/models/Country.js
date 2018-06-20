var mongoose = require('mongoose');

var CountrySchema = new mongoose.Schema({
  name: String,
  location: String,
  telephone: String
 });


module.exports = mongoose.model('Country', CountrySchema,'countrys');
