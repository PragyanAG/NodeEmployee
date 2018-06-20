var express = require('express');
var router = express.Router();
var jobassignment = require("../controllers/JobAssignmentController.js");
var path = require('path');
var multer  =   require('multer');
var JobAssignment = require("../models/JobAssignment");
var cache = require('memory-cache');
var mongoose = require('mongoose');
var fs = require('fs-extra')
var filessystem = require('fs');


// file upload destination folder
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/vesseljobtrackers');
  },
  // file upload extension
  filename: function(req, file, cb) {
	  cb(null, (file.originalname).replace(/ /g,"_"));
  }
});
// file upload variable
var upload = multer({
  storage: storage
});

//common function for save and update

function getEmpByKey(key, data) {
    for (i in data) {
		 if (data[i].employee_id == key) {
            return data[i].firstname + ' ' + data[i].lastname;
        }
    }
}
function getJobCategoryByKey(key, data) {
   
	 for (i in data) {
		 if (data[i]._id == key) {
            return data[i].jobcategory;
        }
    }
}
function getJobTypeByKey(key, data) {
   
	 for (i in data) {
		 if (data[i]._id == key) {
            return data[i].jobtype;
        }
    }
}

function getValueByKey(key, data) {
  for (i in data) {
		 if (data[i]._id == key) {
            return data[i].name;
        }
    }
}
function getClientByKey(key, data) {
  for (i in data) {
		 if (data[i].client_id == key) {
            return data[i].companyname;
        }
    }
}





// Get all employees
router.get('/', function(req, res) {
  jobassignment.list(req, res);
});

// Get single employee by id
router.get('/show/:id', function(req, res) {
  jobassignment.show(req, res);
});

// Create employee
router.get('/create', function(req, res) {
  jobassignment.create(req, res);
    
});

function getNumWorkDays(startDate, endDate) {
    var numWorkDays = 0;
    var currentDate = new Date(startDate);
	
    while (currentDate <= endDate) {
		
        // Skips Sunday and Saturday
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            numWorkDays++;
        }
        currentDate.setDate(currentDate.getDate()+ 1);
    }
    return (numWorkDays - 1);
}

// Save employee
router.post('/save',upload.any(),function(req, res,next) {
	 
	var obj=cache.get('myjsonobj');
	 
	 
	  var job_Assignid;
       
	   mongoose.connection.db.collection("counters").findAndModify( { _id: 'jobassignid' }, null, { $inc: { sequence_value: 1 } }, function(err, result){
        if(err) console.log("Error:",err);
	         job_Assignid = result.value.sequence_value;
			 var uploads;
			 var calcdays;
			 var today = new Date();
             var dd = today.getDate();
             var mm = today.getMonth()+1; //January is 0!
             var yyyy = today.getFullYear();
             var year = yyyy.toString().substr(-2);

             if(dd<10) {
                 dd = '0'+dd;
             } 

             if(mm<10) {
                 mm = '0'+mm;
             } 

            job_Assignid = year + mm + dd + job_Assignid ;
			
			var jobassignment = new JobAssignment({
		    job_Assignid: job_Assignid,
		    company_id: req.body.company,
            company: getClientByKey(req.body.company, obj.company),
            
			vessel: req.body.vessel,
			job_catid: req.body.jobcategory,
			jobcategory: getJobCategoryByKey(req.body.jobcategory, obj.jobcategory),
			job_typeid: req.body.jobtype,
			jobtype: getJobTypeByKey(req.body.jobtype, obj.jobtype),
			employee_id: req.body.employeename,
            employeename: getEmpByKey(req.body.employeename, obj.employee),
			departure: req.body.departure,
            arrival: req.body.arrival,
			vesselschedule: req.body.contact,
			destfrom: req.body.destfrom,
            destto: req.body.destto,
			airdestfrom: req.body.airdestfrom,
			airdestto: req.body.airdestto,
			bfromdt: req.body.bfromdt,
			btodt: req.body.btodt,
			rtcomp: req.body.rtcomp,
			dtdue: req.body.dtdue,
			rtdeliver: req.body.rtdeliver,
			remarks: req.body.remarks
            
            });
			 if(jobassignment.departure != null)
			 {
			   jobassignment.departure = jobassignment.departure.toLocaleDateString("en-US");
			 }
			  if(jobassignment.arrival != null)
			 {
			   jobassignment.arrival = jobassignment.arrival.toLocaleDateString("en-US");
			 }
			 
			 if(jobassignment.bfromdt != null)
			 {
			   jobassignment.bfromdt = jobassignment.bfromdt.toLocaleDateString("en-US");
			 }
			 if(jobassignment.btodt != null)
			 {
			   jobassignment.btodt = jobassignment.btodt.toLocaleDateString("en-US");
			 }
			 if(jobassignment.rtcomp != null)
			 {
			   jobassignment.rtcomp = jobassignment.rtcomp.toLocaleDateString("en-US");
			 }
			 if(jobassignment.rtdeliver != null)
			 {
			   jobassignment.rtdeliver = jobassignment.rtdeliver.toLocaleDateString("en-US");
			 }
			 
			 if(jobassignment.dtdue != null)
			 {
			   jobassignment.dtdue = jobassignment.dtdue.toLocaleDateString("en-US");
			 }
			 
			 if(jobassignment.btodt != null && jobassignment.dtdue != null)
				 {
					var diffDays = getNumWorkDays(new Date(jobassignment.btodt),new Date(jobassignment.dtdue));
					
					jobassignment.dayscount = diffDays - 5;
			    }
			   var dir = './public/uploads/vesseljobtrackers/'+ jobassignment.job_Assignid ;
	    
			   filessystem.mkdirSync(dir);
					
			   var dir1 = './public/uploads/vesseljobtrackers/'+ jobassignment.job_Assignid + '/SEQ' ;
				
			   filessystem.mkdirSync(dir1);
							
			   var dir2 = './public/uploads/vesseljobtrackers/'+ jobassignment.job_Assignid + '/AdditionalDocuments';
				
			   filessystem.mkdirSync(dir2); 
			   
			   var dir3 = './public/uploads/vesseljobtrackers/'+ jobassignment.job_Assignid + '/ETickets';
				
			   filessystem.mkdirSync(dir3); 
					 
			
			console.log(req.files);
			jobassignment.save(function(err) {
              if(err) {
                console.log(err);
                res.render("../views/jobassignments/create");
                }
              else
			  {
				if(req.files.length > 0){
					
					 for(var i = 0; i < req.files.length ;i++)
					   {
						   if(req.files[i].fieldname == "doc")
						{
							console.log("SEQ part");
							fs.move('./public/uploads/vesseljobtrackers/' + req.files[i].filename , dir1 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
					
							var uploaddoc = {columnmap: jobassignment.job_Assignid, document: req.files[i].filename, 
							                 filepath: '/uploads/vesseljobtrackers/'+ jobassignment.job_Assignid + '/SEQ' + '/' + req.files[i].filename,
											 status:'Active' ,typeofdoc: 'SEQ'};
							mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
									  if(err){
										console.log("err",err);
									  }
								
								});
						}
						if(req.files[i].fieldname == "files[]")
							{	   
					              console.log("ADC part");
								  fs.move('./public/uploads/vesseljobtrackers/' + req.files[i].filename , dir2 + '/' + req.files[i].filename, function (err) {
						             if (err) return console.error(err)
						             console.log("success!")
						          });
					
							
								  var uploaddoc = {columnmap: jobassignment.job_Assignid, document: req.files[i].filename, 
								                   filepath: '/uploads/vesseljobtrackers/'+ jobassignment.job_Assignid + '/AdditionalDocuments' + '/' + req.files[i].filename,
												   status:'Active' ,typeofdoc: 'Additional Documents'};
								  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
								  if(err){
									console.log("err",err);
								  }
							  	  });
							}
						if(req.files[i].fieldname == "etkt[]")
							{	   
					              console.log("Eticket part");
								  fs.move('./public/uploads/vesseljobtrackers/' + req.files[i].filename , dir3 + '/' + req.files[i].filename, function (err) {
						             if (err) return console.error(err)
						             console.log("success!")
						          });
					
							
								  var uploaddoc = {columnmap: jobassignment.job_Assignid, document: req.files[i].filename, 
								                   filepath: '/uploads/vesseljobtrackers/'+ jobassignment.job_Assignid + '/ETickets' + '/' + req.files[i].filename,
												   status:'Active' ,typeofdoc: 'ETickets'};
								  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
								  if(err){
									console.log("err",err);
								  }
							  	  });
							}
					 }
						   
				}
				console.log("Successfully created an jobAssignment.");
                JobAssignment.find({}).exec(function (err, jobassignments) {
					if (err) {
                   console.log("Error:", err);
                  }
				   else {
				   cache.del('myjsonobj');
				   res.redirect("/jobassignments");
	              }
				});
			  }				  
			});
			 
	   });
	
});
	
	
// Edit employee
router.get('/edit/:id', function(req, res) {
  jobassignment.edit(req, res);
});

// Edit update
router.post('/update/:id',upload.any(), function(req,res,next) {
	var obj=cache.get('myjsonobj');
  JobAssignment.findById(req.params.id, function(err, data) {	
  
  
  
   
	data.job_catid = req.body.jobcategory;
    data.jobcategory = getJobCategoryByKey(req.body.jobcategory, obj.jobcategory);
    data.job_typeid = req.body.jobtype;
    data.jobtype = getJobTypeByKey(req.body.jobtype, obj.jobtype);
	data.employee_id = req.body.employeename;
    data.employeename = getEmpByKey(req.body.employeename, obj.employee);
	data.vesselschedule = req.body.contact;
    data.departure = req.body.departure;
    data.arrival = req.body.arrival;
	data.destfrom = req.body.destfrom;
	data.destto = req.body.destto;
	data.airdestfrom = req.body.airdestfrom;
	data.airdestto = req.body.airdestto;
    data.bfromdt = req.body.bfromdt;
	data.btodt = req.body.btodt;
	data.rtcomp = req.body.rtcomp;
	data.dtdue = req.body.dtdue;
	data.rtdeliver = req.body.rtdeliver;
	data.remarks = req.body.remarks;
    
    if(data.departure != null)
	 {
	   data.departure = data.departure.toLocaleDateString("en-US");
	 }
	 if(data.arrival != null)
	 {
	   data.arrival = data.arrival.toLocaleDateString("en-US");
	 }
	 if(data.bfromdt != null)
	 {
	   data.bfromdt = data.bfromdt.toLocaleDateString("en-US");
	 }
	 if(data.btodt != null)
	 {
	   data.btodt = data.btodt.toLocaleDateString("en-US");
	 }
	 if(data.rtcomp != null)
	 {
	   data.rtcomp = data.rtcomp.toLocaleDateString("en-US");
	 }
	 if(data.rtdeliver != null)
	 {
	   data.rtdeliver = data.rtdeliver.toLocaleDateString("en-US");
	 }
	 if(data.dtdue != null)
	 {
	   data.dtdue = data.dtdue.toLocaleDateString("en-US");
	 }
	console.log("hi",data); 
    data.save(function(err, data) {
        if (err) {
          return next(err);
        }
		if(req.files.length > 0){
			    var dir1 = './public/uploads/vesseljobtrackers/'+ data.job_Assignid + '/SEQ' ;
			    var dir2 = './public/uploads/vesseljobtrackers/'+ data.job_Assignid + '/AdditionalDocuments';
                var dir3 = './public/uploads/vesseljobtrackers/'+ data.job_Assignid + '/ETickets';				
					 for(var i = 0; i < req.files.length ;i++)
			          {	
				        if(req.files[i].fieldname == "doc")
						{
							fs.move('./public/uploads/vesseljobtrackers/' + req.files[i].filename , dir1 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
							var uploaddoc = {columnmap: data.job_Assignid, document: req.files[i].filename, 
							                 filepath: '/uploads/vesseljobtrackers/'+ data.job_Assignid + '/SEQ' + '/' + req.files[i].filename,
											 status:'Active' ,typeofdoc: 'SEQ'};
									  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
									  if(err){
										console.log("err",err);
									  }
								
							});
						}
                        if(req.files[i].fieldname == "files[]")
				         {	
                            fs.move('./public/uploads/vesseljobtrackers/' + req.files[i].filename , dir2 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
							  var uploaddoc = {columnmap: data.job_Assignid, document: req.files[i].filename, 
							                   filepath: '/uploads/vesseljobtrackers/'+ data.job_Assignid + '/AdditionalDocuments' + '/' + req.files[i].filename,
											   status:'Active' ,typeofdoc: 'Additional Documents'};
							  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
						      if(err){
						        console.log("err",err);
							  }
							  	                       
				              });
						 }					 
					    if(req.files[i].fieldname == "etkt[]")
				         {	
                            fs.move('./public/uploads/vesseljobtrackers/' + req.files[i].filename , dir3 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
							  var uploaddoc = {columnmap: data.job_Assignid, document: req.files[i].filename, 
							                   filepath: '/uploads/vesseljobtrackers/'+ data.job_Assignid + '/ETickets' + '/' + req.files[i].filename,
											   status:'Active' ,typeofdoc: 'ETickets'};
							  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
						      if(err){
						        console.log("err",err);
							  }
							  	                       
				              });
						 }	
					  }
				}
        JobAssignment.find({}).exec(function (err, jobassignments) {
                  if (err) {
                   console.log("Error:", err);
                  }
                  else {
				   cache.del('myjsonobj');
		           res.redirect("/jobassignments");
	              }
                });
      });
    });
  });

// Edit update
router.post('/complete/:id', function(req, res, next) {
  jobassignment.complete(req, res);
});
router.post('/cancel/:id', function(req, res, next) {
  jobassignment.cancel(req, res);
});
module.exports = router;
