var mongoose = require('mongoose');


var EmployeeSchema = new mongoose.Schema({
  employee_id: String,
  firstname: String,
  lastname: String,
  dateofbirth: Date,
  address: String,
  postalcode: String,
  nationality: String,
  country: String,
  city: String,
  gender: String,
  office: String,
  passportno: String,
  dateofjoining: Date,
  designation: String,
  permitstatus: String,
  employeementtype: String,
  workstatus: String,
  maritalstatus: String,
  comment: String,
  fathername: String,
  mothername: String,
  spousename: String,
  noofkids: String,
  mcontactno: String,
  econtactno: String,
  fidno: String,
  photo: String,
  status: String,
  inserted_at: { type: Date, default: Date.now }
  
});


module.exports = mongoose.model('Employee', EmployeeSchema);
