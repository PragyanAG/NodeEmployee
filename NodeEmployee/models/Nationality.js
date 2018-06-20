var mongoose = require('mongoose');
var NationalitylSchema = new mongoose.Schema({
	
	name: String
});

module.exports = mongoose.model('Nationality', NationalitylSchema,'nationality');