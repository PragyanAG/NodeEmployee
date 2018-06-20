var express = require('express');
var router = express.Router();
var vdranalysis = require("../controllers/VdrAnalysisController.js");
var path = require('path');
var multer  =   require('multer');
var VdrAnalysis = require("../models/VdrAnalysis");
var cache = require('memory-cache');
var mongoose = require('mongoose');
var fs = require('fs-extra')
var filessystem = require('fs');


//common function for save and update

function getEmpByKey(key, data) {
    for (i in data) {
		 if (data[i].employee_id == key) {
            return data[i].firstname + ' ' + data[i].lastname;
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


function getValueByKey(key, data) {
  for (i in data) {
		 if (data[i]._id == key) {
            return data[i].name;
        }
    }
}


function formatDate(stringDate){
    var date=new Date(stringDate);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear();
}


// file upload destination folder
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/vdrjobtrackers');
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


// Get all employees
router.get('/', function(req, res) {
  vdranalysis.list(req, res);
});

// Get single employee by id
router.get('/show/:id', function(req, res) {
  vdranalysis.show(req, res);
});

// Create employee
router.get('/create', function(req, res) {
  vdranalysis.create(req, res);
    
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
	 var calcdays;
	 var vdr_id;
       
	   mongoose.connection.db.collection("counters").findAndModify( { _id: 'vdrjobid' }, null, { $inc: { sequence_value: 1 } }, function(err, result){
        if(err) console.log("Error:",err);
	         vdr_id = result.value.sequence_value;
			 var uploads;
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

	  vdr_id = 'V' + year + mm + dd + vdr_id ;
			
	 
	 
	 var vdranalysis = new VdrAnalysis({
		    vdr_id: vdr_id,
		    auditor_id: req.body.employeename,
            auditorname: getEmpByKey(req.body.employeename, obj.employee),
			vessel_id: req.body.vessel,
			vessel: getValueByKey(req.body.vessel, obj.vessel),
			company_id: req.body.company,
            company: getClientByKey(req.body.company, obj.company),
			vdrtype: req.body.contact,
            vdrmake: req.body.vdrmake,
			
			analysis_id: req.body.analysis,
			analysis: getValueByKey(req.body.analysis,obj.analysis),
			drcvclient: req.body.drcvclient,
			alldocrcvd: req.body.alldocrcvd,
			dtdatasent: req.body.dtdatasent,
			dtanacomp: req.body.dtanacomp,
			dtassign: req.body.dtassign,
			dtdeliver: req.body.dtdeliver,
			dtcomp: req.body.dtcomp,
			duedate: req.body.duedate,
			remarks: req.body.remarks,
            status:'Active'
            
            });
	if(vdranalysis.drcvclient != null)
	 {
	   vdranalysis.drcvclient = new Date(vdranalysis.drcvclient);
	   vdranalysis.drcvclient = vdranalysis.drcvclient.toISOString();
	 }
	 if(vdranalysis.alldocrcvd != null)
	 {
	   vdranalysis.alldocrcvd = vdranalysis.alldocrcvd.toLocaleDateString("en-US");
	   vdranalysis.alldocrcvd = vdranalysis.alldocrcvd.toISOString();
	 }
	 if(vdranalysis.dtdatasent != null)
	 {
	   vdranalysis.dtdatasent = vdranalysis.dtdatasent.toLocaleDateString("en-US");
	   vdranalysis.dtdatasent = vdranalysis.dtdatasent.toISOString();
	 }
	 if(vdranalysis.dtanacomp != null)
	 {
	   vdranalysis.dtanacomp = vdranalysis.dtanacomp.toLocaleDateString("en-US");
	   vdranalysis.dtanacomp = vdranalysis.dtanacomp.toISOString();
	 }
	 if(vdranalysis.dtassign != null)
	 {
	   vdranalysis.dtassign = vdranalysis.dtassign.toLocaleDateString("en-US");
	   vdranalysis.dtassign = vdranalysis.dtassign.toISOString();
	 }
	 if(vdranalysis.dtdeliver != null)
	 {
	   vdranalysis.dtdeliver = vdranalysis.dtdeliver.toLocaleDateString("en-US");
	   vdranalysis.dtdeliver = vdranalysis.dtdeliver.toISOString();
	 }
	 if(vdranalysis.dtcomp != null)
	 {
	   vdranalysis.dtcomp = vdranalysis.dtcomp.toLocaleDateString("en-US");
	   vdranalysis.dtcomp = vdranalysis.dtcomp.toISOString();
	 }
	 if(vdranalysis.duedate != null)
	 {
	   vdranalysis.duedate = new Date(vdranalysis.duedate);
	   vdranalysis.duedate = vdranalysis.duedate.toISOString();
	 }
	  
	 if(vdranalysis.alldocrcvd != null && vdranalysis.drcvclient != null && vdranalysis.duedate != null)
	 {
		if(new Date(vdranalysis.alldocrcvd)>=new Date(vdranalysis.drcvclient))
		{
			calcdays = vdranalysis.alldocrcvd;
		}
		else{
			calcdays = vdranalysis.drcvclient;
		}
		
		
		var diffDays = getNumWorkDays(new Date(calcdays),new Date(vdranalysis.duedate));
		
		vdranalysis.dayscount = diffDays - 14;
	 }

	   console.log(vdranalysis.dayscount);
	  
	   var dir = './public/uploads/vdrjobtrackers/'+ vdranalysis.vdr_id ;
	    
	   filessystem.mkdirSync(dir);
			
	   var dir1 = './public/uploads/vdrjobtrackers/'+ vdranalysis.vdr_id + '/SEQ' ;
	    
	   filessystem.mkdirSync(dir1);
					
	   var dir2 = './public/uploads/vdrjobtrackers/'+ vdranalysis.vdr_id + '/AdditionalDocuments';
	    
	   filessystem.mkdirSync(dir2); 
	  
	  
	   	
	 vdranalysis.save(function(err) {
              if(err) {
                console.log(err);
                res.render("../views/vdranalysiss/create");
                } else {
				  if(req.files.length > 0){
					  
					  for(var i = 0; i < req.files.length ;i++)
					   {
					    
						if(req.files[i].fieldname == "doc")
						{
							console.log("SEQ part");
						
							fs.move('./public/uploads/vdrjobtrackers/' + req.files[i].filename , dir1 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
							
							var uploaddoc = {columnmap: vdranalysis.vdr_id, document: req.files[i].filename, 
											 filepath: '/uploads/vdrjobtrackers/'+ vdranalysis.vdr_id + '/SEQ' + '/' + req.files[i].filename,
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
								  fs.move('./public/uploads/vdrjobtrackers/' + req.files[i].filename , dir2 + '/' + req.files[i].filename, function (err) {
						             if (err) return console.error(err)
						             console.log("success!")
						          });
								  
								  var uploaddoc = {columnmap: vdranalysis.vdr_id, 
								  filepath: '/uploads/vdrjobtrackers/'+ vdranalysis.vdr_id + '/AdditionalDocuments' + '/' + req.files[i].filename,
								  document: req.files[i].filename, status:'Active' ,typeofdoc: 'AdditionalDocuments'};
								  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
								  if(err){
									console.log("err",err);
								  }
														   
								  });
								  
								  
				   
					    }
					   }
						
				   }
				   
				   
					
					
					
					
                console.log("Successfully created an vdrtracker.");
                VdrAnalysis.find({}).exec(function (err, vdranalysiss) {
                  if (err) {
                   console.log("Error:", err);
                  }
                  else {
				   cache.del('myjsonobj');
				   res.redirect("/vdranalysiss");
	              }
                });
				}
            });
	
	   });
});
	
	
// Edit employee
router.get('/edit/:id', function(req, res) {
  vdranalysis.edit(req, res);
});

// Edit update
router.post('/update/:id',upload.any(), function(req,res,next) {
	var obj=cache.get('myjsonobj');
  VdrAnalysis.findById(req.params.id, function(err, data) {	
  
            data.auditor_id= req.body.employeename;
            data.auditorname= getEmpByKey(req.body.employeename, obj.employee);
			data.vdrtype = req.body.contact;
			data.vdrmake = req.body.vdrmake;
			
			data.analysis_id = req.body.analysis;
			data.analysis = getValueByKey(req.body.analysis, obj.analysis);
            data.drcvclient = req.body.drcvclient;
			data.alldocrcvd = req.body.alldocrcvd;
			data.dtdatasent = req.body.dtdatasent;
			data.dtanacomp = req.body.dtanacomp;
			data.dtassign = req.body.dtassign;
			data.dtdeliver = req.body.dtdeliver;
			data.dtcomp = req.body.dtcomp;
			data.duedate = req.body.duedate;
			data.remarks = req.body.remarks;
  
    if(data.drcvclient != null)
	 {
	   data.drcvclient = data.drcvclient.toLocaleDateString("en-US");
	 }
	 if(data.alldocrcvd != null)
	 {
	   data.alldocrcvd = data.alldocrcvd.toLocaleDateString("en-US");
	 }
	 if(data.dtdatasent != null)
	 {
	   data.dtdatasent = data.dtdatasent.toLocaleDateString("en-US");
	 }
	 if(data.dtanacomp != null)
	 {
	   data.dtanacomp = data.dtanacomp.toLocaleDateString("en-US");
	 }
	 if(data.dtassign != null)
	 {
	   data.dtassign = data.dtassign.toLocaleDateString("en-US");
	 }
	 if(data.dtdeliver != null)
	 {
	   data.dtdeliver = data.dtdeliver.toLocaleDateString("en-US");
	 }
	 if(data.dtcomp != null)
	 {
	   data.dtcomp = data.dtcomp.toLocaleDateString("en-US");
	 }
	 if(data.duedate != null)
	 {
	   data.duedate = data.duedate.toLocaleDateString("en-US");
	 }

	 if(data.alldocrcvd != null && data.drcvclient != null)
	 {
		 data.dayscount = getBusinessDatesCount(new Date(data.alldocrcvd),new Date(data.drcvclient));
	 }
	 
    data.save(function(err, data) {
        if (err) {
          return next(err);
        }
		
    
		if(req.files.length > 0){
			
			var dir1 = './public/uploads/vdrjobtrackers/'+ data.vdr_id + '/SEQ' ;
			var dir2 = './public/uploads/vdrjobtrackers/'+ data.vdr_id + '/AdditionalDocuments';	

			
			 for(var i = 0; i < req.files.length ;i++)
			    {		
					     if(req.files[i].fieldname == "doc")
						{
							console.log(req.files[i].fieldname);
							fs.move('./public/uploads/vdrjobtrackers/' + req.files[i].filename , dir1 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
							var uploaddoc = {columnmap: data.vdr_id, document: req.files[i].filename, 
							                 filepath: '/uploads/vdrjobtrackers/'+ data.vdr_id + '/SEQ' + '/' + req.files[i].filename,
											 status:'Active' ,typeofdoc: 'SEQ'};
									  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
									  if(err){
										console.log("err",err);
									  }
								
								});
						}
					      if(req.files[i].fieldname == "files[]")
				           {
							   console.log(req.files[i].fieldname);
							fs.move('./public/uploads/vdrjobtrackers/' + req.files[i].filename , dir2 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
							  var uploaddoc = {columnmap: data.vdr_id, document: req.files[i].filename, 
							                   filepath: '/uploads/vdrjobtrackers/'+ data.vdr_id + '/AdditionalDocuments' + '/' + req.files[i].filename,
											   status:'Active' ,typeofdoc: 'AdditionalDocuments'};
							  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
						      if(err){
						        console.log("err",err);
							  }
							  	                       
				              });
						   }
				}
		}
        VdrAnalysis.find({}).exec(function (err, vdranalysiss) {
                  if (err) {
                   console.log("Error:", err);
                  }
                  else {
				   cache.del('myjsonobj');
		           res.redirect("/vdranalysiss");
	              }
                });
      });
    });
  });

// Edit update
router.post('/complete/:id', function(req, res, next) {
  vdranalysis.complete(req, res);
});
router.post('/cancel/:id', function(req, res, next) {
  vdranalysis.cancel(req, res);
});
module.exports = router;
