var mongoose = require('mongoose');
var BankSchema = new mongoose.Schema({
	name: String
	
});

module.exports = mongoose.model('Bank', BankSchema,'bank');