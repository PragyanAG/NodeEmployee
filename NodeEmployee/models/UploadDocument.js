var mongoose = require('mongoose');
var UploadDocumentTypeSchema = new mongoose.Schema({
	columnmap: String,
	document: String,
	filepath: String,
	status: String,
	typeofdoc: String
});

module.exports = mongoose.model('UploadDocument', UploadDocumentTypeSchema,'uploaddocuments');