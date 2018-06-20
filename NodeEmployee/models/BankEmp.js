var mongoose = require('mongoose');
var BankEmpSchema = new mongoose.Schema({
	employee_id: String,
	bankname_id:String,
	bankname: String,
	address: String,
	scode: String,
	ifsccode: String,
	accountno: String,
	status: String
	
});

module.exports = mongoose.model('BankEmp', BankEmpSchema,'bankemp');