var mongoose = require('mongoose');
var VesselSchema = new mongoose.Schema({
	
	name: String
});

module.exports = mongoose.model('Vessel', VesselSchema,'vessels');