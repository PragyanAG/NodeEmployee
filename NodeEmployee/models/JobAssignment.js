var mongoose = require('mongoose');


var JobAssignmentSchema = new mongoose.Schema({
  job_Assignid: String,
  company_id: String,
  company: String,
  vessel: String,
  job_catid: String,
  jobcategory: String,
  job_typeid: String,
  jobtype: String,
  employee_id: String,		
  employeename: String,
  departure: Date,
  arrival: Date,
  vesselschedule: String,
  destf_id: String,
  destfrom: String,
  destt_id: String,
  destto: String,
  airdestfrom: String,
  airdestto: String,
  bfromdt: Date,
  btodt: Date,
  rtcomp: Date,
  rtdeliver: Date,
  dtdue: Date,
  remarks: String,
  dayscount: String,
  inserted_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('JobAssignment', JobAssignmentSchema,'jobassignments');