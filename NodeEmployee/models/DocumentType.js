var mongoose = require('mongoose');
var DocumentTypeSchema = new mongoose.Schema({
	
	name: String
});

module.exports = mongoose.model('DocumentType', DocumentTypeSchema,'documenttype');