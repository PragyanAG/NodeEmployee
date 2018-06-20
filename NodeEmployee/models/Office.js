var mongoose = require('mongoose');
var OfficeSchema = new mongoose.Schema({
	name: String
	
});

module.exports = mongoose.model('Office', OfficeSchema,'office');