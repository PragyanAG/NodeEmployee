var mongoose = require('mongoose');
var PayslipEmpSchema = new mongoose.Schema({
	employee_id: String,
	year:String,
	month: String,
	filepath: String,
	filename: String,
	status: String
	
});

module.exports = mongoose.model('PayslipEmp', PayslipEmpSchema,'payslip');