var mongoose = require('mongoose');
var VisaEmpSchema = new mongoose.Schema({
	visaemp_id: String,
	country: String,
	expirydate: String,
	visatype: String,
	filename: String,
	filepath: String,
	status: String,
	employee_id: String
	
});

module.exports = mongoose.model('VisaEmp', VisaEmpSchema,'visaemp');