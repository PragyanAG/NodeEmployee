var mongoose = require('mongoose');
var DocumentsEmpSchema = new mongoose.Schema({
	employee_id: String,
	documenttype_id: String,
	documentype: String,
	filepath: String,
	filename: String,
	status: String
	
});

module.exports = mongoose.model('DocumentEmp', DocumentsEmpSchema,'documentemp');