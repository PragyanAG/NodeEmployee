var mongoose = require('mongoose');
var DocSchema = new mongoose.Schema({
	
	columnmap: String,
	document: String,
	filepath: String,
	status: String,
	typeofdoc: String
});

module.exports = mongoose.model('Doc', DocSchema,'uploaddocuments');