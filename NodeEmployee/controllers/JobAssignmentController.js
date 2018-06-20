var mongoose = require("mongoose");
var JobAssignment = require("../models/JobAssignment");
var JobType = require("../models/JobType");
var JobCategory = require("../models/JobCategory");

var Employee = require("../models/Employee");
var Company=require("../models/Client");
var Country=require("../models/Country");
var Doc=require("../models/Doc");
var moment = require('moment-business-days');
var cache = require('memory-cache');


var obj = {};



var jobAssignmentController = {};




// Show list of jobAssignments
jobAssignmentController.list = function(req, res) {
  JobAssignment.find({}).exec(function (err, jobassignments) {
  
	  
    if (err) {
      console.log("Error:", err);
    }
    else {
	  res.render("../views/jobassignments/index", {jobassignments: jobassignments});
    }
  });
};

// Show jobAssignments by id
jobAssignmentController.show = function(req, res) {
  JobAssignment.findOne({_id: req.params.id}).exec(function (err, jobassignment) {
    if (err) {
      console.log("Error:", err);
    }
	Doc.find({columnmap: jobassignment.job_Assignid,status: 'Active'}).exec(function (err, listofdoc) {
    if (err) {
      console.log("Error:", err);
    }
	console.log(listofdoc);
    res.render("../views/jobassignments/show", {jobassignment: jobassignment,listofdoc: listofdoc});
    
	});
  });
};

// Create new jobAssignments
jobAssignmentController.create = function(req, res) {


	Employee.find({status:'Active'}).exec(function(err,employee){
		   if(err){
			   console.log("Error:",err);
		   }
		
	JobCategory.find({status:'Active'}).exec(function(err,jobcategory){
	        if(err){
				console.log("Error:",err);
			}
			;
	JobType.find({status:'Active'}).exec(function(err,jobtype){
	        if(err){
				console.log("Error:",err);
			}
			
   				
    Company.find({status:'Active'}).exec(function(err,company){
	        if(err){
				console.log("Error:",err);
			}
			
    
							
			
			obj['employee'] = employee;
            obj['jobcategory'] = jobcategory;
			obj['jobtype'] = jobtype;
            
            obj['company'] = company;
			
            
			cache.put('myjsonobj', obj);
            
			var airport = cache.get('objAirport');
			var country = require ('countries-cities').getCountries();
			
    		res.render("../views/jobassignments/create",{employee:employee,jobcategory:jobcategory,jobtype:jobtype,
			                                             company:company,country:country,airport:airport});
			
	});
	});
	});
	});	
	
	
	//to store data or json object into cache
    
	
};

// Save new jobAssignments

   

// Edit an jobAssignments
jobAssignmentController.edit = function(req, res) {
	
	Employee.find({status:'Active'}).exec(function(err,employee){
		   if(err){
			   console.log("Error:",err);
		   }
		   
	JobCategory.find({status:'Active'}).exec(function(err,jobcategory){
	        if(err){
				console.log("Error:",err);
			}
    JobType.find({status:'Active'}).exec(function(err,jobtype){
	        if(err){
				console.log("Error:",err);
			}
			
   
				
    Company.find({status:'Active'}).exec(function(err,company){
	        if(err){
				console.log("Error:",err);
			}
				
  
							
			
			obj['employee'] = employee;
            obj['jobcategory'] = jobcategory;
			obj['jobtype'] = jobtype;
            obj['company'] = company;
			
            
			cache.put('myjsonobj', obj);
	        var airport = cache.get('objAirport');
			var country = require ('countries-cities').getCountries();
	
    JobAssignment.findOne({_id: req.params.id}).exec(function (err, jobassignment) {
    if (err) {
      console.log("Error:", err);
    }
	Doc.find({status:'Active',columnmap: jobassignment.job_Assignid}).exec(function(err,listofdoc){
	        if(err){
				console.log("Error:",err);
			}
    else {
		
      res.render("../views/jobassignments/edit", {jobassignment: jobassignment,employee:employee,jobcategory:jobcategory,airport:airport,
	                                              jobtype: jobtype,listofdoc: listofdoc,company:company,country:country});
    }
	});
	});
	});
	});
	});
	
	});
  
};


// Delete a Client
jobAssignmentController.complete = function(req, res) {
	
	 JobAssignment.findById(req.params.id, function(err, data) {	
	 data.vesselschedule = 'completed';
	 
	 
	 
	var myquery = { columnmap: data.job_Assignid };
    var newvalues = {$set: {vesselschedule: "completed"} };
    
	 data.save(function(err, data) {
        if (err) {
          console.log("Error:", err);
        }
	 
        else {
          console.log("Vessel job tracker completed!");
          res.redirect("/jobassignments");
    }
  });
  });
};

jobAssignmentController.cancel = function(req, res) {
	
	 JobAssignment.findById(req.params.id, function(err, data) {	
	 
	 
	 var newvalues;
	 var valStatus = data.vesselschedule;
	 var newStatus;
	 var myquery = { columnmap: data.job_Assignid };
	 if(valStatus == "cancelled"){
		  
	      newStatus = 'Active';
	      
	 }
	 if(valStatus != "cancelled"){
		 
		  newStatus = 'cancelled';
	      
	 }
	  
	 data.vesselschedule = newStatus;
	 
	 
	
	 
	 data.save(function(err, data) {
        if (err) {
          console.log("Error:", err);
        }
	 
        else {
          console.log("Vessel job tracker cancelled!");
          res.send('{status:200}');
		           
	           
    }
  });
  });
};
module.exports = jobAssignmentController;
