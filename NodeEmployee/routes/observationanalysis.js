var express = require('express');
var router = express.Router();
var observationanalysis = require("../controllers/ObservationAnalysisController.js");
var path = require('path');
var multer  =   require('multer');
var ObservationAnalysis = require("../models/ObservationAnalysis");
var cache = require('memory-cache');
var mongoose = require('mongoose');
var Obs = require("../models/Obs");
var fs = require('fs');


var csv = require('fast-csv');



var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/csv/');
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
function getLocByKey(key, data){
	for(i in data){
		if(data[i]._id == key){
			return data[i].location;
		}
	}
}
function getcatbykey(key, data){
	for(i in data){
		if(data[i]._id == key){
			return data[i].category;
		}
	}
}
function getsubcatbykey(key, data){
	for(i in data){
		if(data[i]._id == key){
			return data[i].subcategory;
		}
	}
}

function getnatbykey(key,data){
  var natobj = [];
  for (var i=0;i <data.length ; i++)
  {
	 for(var j=0;j<key.length;j++)
	  {
		 if(data[i]._id == key[j])
			  natobj.push(data[i].name);
	  }
  }
  
  

   	return natobj;  
}



// Get all employees
router.get('/', function(req, res) {
  observationanalysis.list(req, res);
});

// Get single employee by id
router.get('/show/:id', function(req, res) {
  observationanalysis.show(req, res);
});

// Create employee
router.get('/create', function(req, res) {
  observationanalysis.create(req, res);
    
});

// Save employee
router.post('/save',function(req, res,next) {
	 
	var obj=cache.get('myjsonobj');
	 
	 
	  var obs_Analysisid;
       
	   mongoose.connection.db.collection("counters").findAndModify( { _id: 'obsanalysisid' }, null, { $inc: { sequence_value: 1 } }, function(err, result){
        if(err) console.log("Error:",err);
	         obs_Analysisid = result.value.sequence_value;
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

            obs_Analysisid = 'O' + year + mm + dd + obs_Analysisid ;
			
			
			var observationanalysis = new ObservationAnalysis({
		    obs_Analysisid: obs_Analysisid,
		    job_catid: req.body.jobcategory,
			jobcategory: getJobCategoryByKey(req.body.jobcategory, obj.jobcategory),
			job_typeid: req.body.jobtype,
			jobtype: getJobTypeByKey(req.body.jobtype, obj.jobtype),
			vessel_id: req.body.vessel,
			vessel: getValueByKey(req.body.vessel, obj.vessel),
			company_id: req.body.company,
            company: getClientByKey(req.body.company, obj.company),
			reviewdate: req.body.reviewdate,
            country: req.body.country,
            city: req.body.city,
			nonationality: req.body.nonationality,
			status:'Active'
            
            });
			
			if(req.body.nationality)
			{
		    observationanalysis.nationality = req.body.nationality;
			}
			
			if(observationanalysis.reviewdate != null)
			 {
			   observationanalysis.reviewdate = observationanalysis.reviewdate.toLocaleDateString("en-US");
			 }
			
			observationanalysis.save(function(err) {
              if(err) {
                console.log(err);
                res.render("../views/observationanalysis/create");
                }
              else
			  {
				
				console.log("Successfully created an observationanalysis.");
                ObservationAnalysis.find({}).exec(function (err, observationanalysis) {
					if (err) {
                   console.log("Error:", err);
                  }
				   else {
				   cache.del('myjsonobj');
				   res.redirect("/observationanalysis");
				   }
				});
			  }				  
			});
			 
	   });
	
});
	
	
// Edit employee
router.get('/edit/:id', function(req, res) {
  observationanalysis.edit(req, res);
});

// Edit update
router.post('/update/:id', function(req,res,next) {
	var obj=cache.get('myjsonobj');
  ObservationAnalysis.findById(req.params.id, function(err, data) {	
  
             
            data.reviewdate = req.body.reviewdate;
            data.country = req.body.country;
			data.city = req.body.city;
			data.nonationality = req.body.nonationality;
			
			if(req.body.nationality)
			{
		    data.nationality = req.body.nationality;
			
			}
  data.save(function(err, data) {
        if (err) {
          return next(err);
        }
		
        ObservationAnalysis.find({}).exec(function (err, observationanalysis) {
                  if (err) {
                   console.log("Error:", err);
                  }
                  else {
				   cache.del('myjsonobj');
		           res.redirect("/observationanalysis");}
                });
      });
    });
  });

// Edit update
router.post('/complete/:id', function(req, res, next) {
  observationanalysis.complete(req, res);
});
router.get('/returncity', function(req, res, next) {
   var country_name = req.query.country_name;
   
   var cities = require ('countries-cities').getCities(country_name); 
   
   res.send(cities);
   
});
router.get('/returnobs', function(req, res, next) {
   var obs_Analysisid = req.query.obs_Analysisid;
   console.log(req.query.obs_Analysisid);
   Obs.find({obs_Analysisid:req.query.obs_Analysisid}).exec(function (err, observation) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   
   console.log(observation);
   res.send(observation);
   }); 
});

router.post('/upload', upload.any(), function (req, res, next) {
  var fileRows = [], fileHeader;
  
  console.log("start");
  console.log("abc",req.files);
  console.log("abccx",req.files[0].path);
  console.log(req.body.id1);
  // open uploaded file
  csv.fromPath(req.files[0].path)
    .on("data", function (data) {
		
      fileRows.push(data); // push each row
    })
	
    .on("end", function () {
      fs.unlinkSync(req.files[0].path);   // remove temp file
      //process "fileRows"
	  
	  for(var i=1;i<fileRows.length;i++){
		  console.log(fileRows[i][0]);
		  var observation = new Obs({
		  obs_Analysisid: req.body.id1,
		  category: fileRows[i][0],
		  subcategory: fileRows[i][1],
		  observation: fileRows[i][2],
		  risk: fileRows[i][3]
		  });
		  console.log(observation);
		  observation.save(function(err) {
              if(err) {
                console.log(err);
                res.render("../views/observationanalysis/index");
                } else {
                Obs.find({obs_Analysisid:req.body.id1}).exec(function (err, observation) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   				   console.log(observation);
				   res.send(observation);
				   }); 
				}
			  
            });
	  }
    })
	
});
module.exports = router;
