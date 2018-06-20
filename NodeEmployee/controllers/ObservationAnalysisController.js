var mongoose = require("mongoose");
var ObservationAnalysis = require("../models/ObservationAnalysis");
var JobType = require("../models/JobType");
var JobCategory = require("../models/JobCategory");
var Vessel = require("../models/Vessel");
var Company=require("../models/Client");
var Country=require("../models/Country");
var Category=require("../models/Category");
var SubCategory=require("../models/SubCategory");
var Nationality=require("../models/Nationality");

var cache = require('memory-cache');


var obj = {};



var observationAnalysisController = {};




// Show list of ObservationAnalysis
observationAnalysisController.list = function(req, res) {
  ObservationAnalysis.find({}).exec(function (err, observationanalysis) {
    if (err) {
      console.log("Error:", err);
    }
    else {
	  res.render("../views/observationanalysis/index", {observationanalysis: observationanalysis});
    }
  });
};


observationAnalysisController.create = function(req, res) {

	JobType.find({status:'Active'}).exec(function(err,jobtype){
		   if(err){
			   console.log("Error:",err);
		   }
	
	JobCategory.find({status:'Active'}).exec(function(err,jobcategory){
	        if(err){
				console.log("Error:",err);
			}
			
	
    Vessel.find({}).exec(function(err,vessel){
	        if(err){
				console.log("Error:",err);
			}
				
    Company.find({status:'Active'}).exec(function(err,company){
	        if(err){
				console.log("Error:",err);
			}
			console.log(company);	
    
							
			
			
            obj['jobcategory'] = jobcategory;
			obj['jobtype'] = jobtype;
            obj['vessel'] = vessel;
            obj['company'] = company;
			
			cache.put('myjsonobj', obj);
            
			var country = require ('countries-cities').getCountries();
			var nationality = cache.get('objNat');
			
    		res.render("../views/observationanalysis/create",{nationality:nationality,jobcategory:jobcategory,jobtype:jobtype,
			                                                  vessel:vessel,company:company,country:country});
	
	});	
	});
	});
	});
	
	
	//to store data or json object into cache
    
	
};

observationAnalysisController.show = function(req, res) {
	var nationality = cache.get('objNat');
  ObservationAnalysis.findOne({_id: req.params.id}).exec(function (err, observationanalysis) {
    if (err) {
      console.log("Error:", err);
    }
	
	res.render("../views/observationanalysis/show", {nationality:nationality,observationanalysis: observationanalysis});
    
	});
 
};

// Delete a Client
observationAnalysisController.complete = function(req, res) {
	
	 ObservationAnalysis.findById(req.params.id, function(err, data) {	
	 data.status = 'Inactive';
	 
	 console.log(data);
	 
	
	 data.save(function(err, data) {
        if (err) {
          console.log("Error:", err);
        }
	 
        else {
          console.log("observationAnalysis inactivated!");
          ObservationAnalysis.find({status:'Active'}).exec(function (err, observationanalysis) {
                  if (err) {
                   console.log("Error:", err);
                  }
                  else {
				   res.redirect("/observationanalysis");
		           }
                });
    }
  });
  });
};

observationAnalysisController.edit = function(req, res) {
				
   
			var country = require ('countries-cities').getCountries();
			var nationality = cache.get('objNat');
		
			
			cache.put('myjsonobj', obj);
	
	
    ObservationAnalysis.findOne({_id: req.params.id}).exec(function (err, observationanalysis) {
    if (err) {
      console.log("Error:", err);
    }
	
    else {
		console.log(observationanalysis);
      res.render("../views/observationanalysis/edit", {observationanalysis: observationanalysis,country:country,
	                                                   nationality:nationality});
    }
	
	});
	
};


module.exports = observationAnalysisController;
