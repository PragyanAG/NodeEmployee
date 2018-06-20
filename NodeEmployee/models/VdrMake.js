var mongoose = require('mongoose');
var VdrMakeSchema = new mongoose.Schema({
	
	name: String
});

module.exports = mongoose.model('VdrMake', VdrMakeSchema,'vdrmake');