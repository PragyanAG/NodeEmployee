var mongoose = require("mongoose");
var Employee = require("../models/Employee");

var Nationality = require("../models/Nationality");
var DocumentType = require("../models/DocumentType");
var Bank = require("../models/Bank");
var BankEmp = require("../models/BankEmp");
var Office = require("../models/Office");

var employeeController = {};

var cache = require('memory-cache');
var obj = {};

// Show list of employees

employeeController.list = function(req, res) {
  var country = require ('countries-cities').getCountries();
  
   mongoose.connection.db.collection("year").find({'name':{'$ne':'All'}}).toArray(function(err, year){
     if(err) console.log("Error:",err);
  
  Employee.find({}).exec(function (err, employees) {
    if (err) {
      console.log("Error:", err);
    }
	DocumentType.find({}).exec(function(err, documenttype){
		if(err){
				console.log("Error:",err);
			}
	BankEmp.find({}).exec(function(err, bankemp){
		if(err){
				console.log("Error:",err);
			}
	Bank.find({}).exec(function(err, bank){
		if(err){
				console.log("Error:",err);
			}
	
    else {
	  obj['documenttype'] = documenttype;
	  obj['bankemp'] = bankemp;
	  obj['bank'] = bank;
	  
	  cache.put('myjsonobj', obj);
	  res.render("../views/employees/index", {employees: employees,country:country,documenttype:documenttype,bankemp:bankemp,bank:bank,year:year});
	}
	});
	});
	});
  });
  });
};

// Show employee by id
employeeController.show = function(req, res) {
  Employee.findOne({_id: req.params.id}).exec(function (err, employee) {
    if (err) {
      console.log("Error:", err);
    }
  
    else {
		console.log(employee);
      res.render("../views/employees/show", {employee: employee});
    }
  });
};

// Create new employee
employeeController.create = function(req, res) {
	
	var country = require ('countries-cities').getCountries();
	
	Office.find({}).exec(function(err, office){
		if(err){
				console.log("Error:",err);
			}
	Bank.find({}).exec(function(err,bank){
	        if(err){
				console.log("Error:",err);
			}
	DocumentType.find({}).exec(function(err, documenttype){
		if(err){
				console.log("Error:",err);
			}
			
			
			obj['bank'] = bank;
			obj['documenttype'] = documenttype;
			obj['office'] = office;
			cache.put('myjsonobj', obj);
			
			var objCountry = cache.get('objCAC');
	        
			var nationality = cache.get('objNat');
			
			var phonecode = cache.get('objPhoneCode');
						
            res.render("../views/employees/create",{country:country,nationality:nationality,bank:bank,documenttype:documenttype,office:office,phonecode:phonecode});
	
	});
	});
	});
};

// Save new employee


// Edit an employee
employeeController.edit = function(req, res) {
	var country = require ('countries-cities').getCountries();
    var objCountry = cache.get('objCAC');
	        
	var nationality = cache.get('objNat');
	var phonecode = cache.get('objPhoneCode');
	Office.find({}).exec(function(err, office){
		if(err){
				console.log("Error:",err);
			}
	
	
			
			cache.put('myjsonobj', obj);
	
    Employee.findOne({_id: req.params.id}).exec(function (err, employee) {
	  console.log(employee);
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/employees/edit", {employee: employee,country:country,nationality:nationality,office:office,phonecode:phonecode});
    }
    });
    });
	
};

// Update an employee


// inactive an employee
employeeController.inactive = function(req, res) {
   Employee.findById(req.params.id, function(err, data) {	
	 var newvalues;
	 var valStatus = data.status;
	 var newStatus;
	 
	 if(valStatus == "Inactive"){
		 
	      newStatus = 'Active';
	      newvalues = {$set: {status: "Active"} };
	 }
	 if(valStatus == "Active"){
		  
		  newStatus = 'Inactive';
	      newvalues = {$set: {status: "Inactive"} };
	 }
	 data.status=newStatus;	  
	
	 data.save(function(err, data) {
        if (err) {
          console.log("Error:", err);
        }
	 
        else {
          console.log("Employee Inactive/Active!");
          Employee.find({}).exec(function (err, employees) {
                  if (err) {
                   console.log("Error:", err);
                  }
                  else {
		           res.redirect("/employees");
	              }
                });
    }
  });
});
};

module.exports = employeeController;
