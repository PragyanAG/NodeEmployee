var mongoose = require('mongoose');
var AnalysisMakeSchema = new mongoose.Schema({
	
	name: String
});

module.exports = mongoose.model('Analysis', AnalysisMakeSchema,'analysis');