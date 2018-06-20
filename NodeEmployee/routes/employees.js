var express = require('express');
var mongoose = require('mongoose');
var employee = require("../controllers/EmployeeController.js");
var path = require('path');
var multer  =   require('multer');
var app = express();
var router = express.Router();
var cache = require('memory-cache');
var bodyParser = require('body-parser');
var Employee = require("../models/Employee");
var BankEmp = require("../models/BankEmp");
var PayslipEmp = require("../models/PayslipEmp");
var Bank = require("../models/Bank");
var VisaEmp = require("../models/VisaEmp");
var DocumentEmp = require("../models/DocumentEmp");
var DocumentType = require("../models/DocumentType");
var fs = require('fs-extra')
var filessystem = require('fs');
const opn= require('opn');

function getValueByKey(key, data) {
   for (i in data) {
		 if (data[i]._id == key) {
            return data[i].name;
        }
    }
}

// file upload destination folder
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/employeerecords');
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
  employee.list(req, res);
});

// Get single employee by id
router.get('/show/:id', function(req, res) {
  employee.show(req, res);
});

// Create employee
router.get('/create', function(req, res) {
  employee.create(req, res);
    
});



// Save employee
router.post('/save',upload.any(), function(req, res,next) {
	
	var obj=cache.get('myjsonobj');
	
	console.log(req.body);
	   var employee = new Employee({
            firstname: req.body.firstname,
			lastname:req.body.lastname,
			dateofbirth:req.body.dateofbirth,
			address:req.body.address,
			postalcode:req.body.postalcode,
			nationality:req.body.nationality,
			country:req.body.country,
			city:req.body.city,
			gender:req.body.gender,
			office:req.body.office,
			passportno:req.body.passportno,
			dateofjoining:req.body.dateofjoining,
			designation:req.body.designation,
			permitstatus:req.body.permitstatus,
			workstatus:req.body.workstatus,
			maritalstatus:req.body.maritalstatus,
			comment:req.body.comment,
			fathername:req.body.fathername,
			mothername:req.body.mothername,
            spousename:req.body.spousename,
            noofkids:req.body.noofkids,
			mcontactno:req.body.mcountry_code + ' ' + req.body.mcontactno,
            econtactno:req.body.ecountry_code + ' ' + req.body.econtactno,
            fidno:req.body.fidno,
            employeementtype:req.body.emptype        
			   
	});
	 
     
	 
	 if(employee.dateofbirth != null)
	 {
	  employee.dateofbirth = employee.dateofbirth.toLocaleDateString("en-US");
	 }
	 if(employee.dateofjoining != null)
	 {
	   employee.dateofjoining = employee.dateofjoining.toLocaleDateString("en-US");
	 }
	 
	
	 
	 var employee_id;
       
	   mongoose.connection.db.collection("counters").findAndModify( { _id: 'employeeid' }, null, { $inc: { sequence_value: 1 } }, function(err, result){
        if(err) console.log("Error:",err);
	        
			employee_id = result.value.sequence_value;
			
			 
 
       employee.employee_id = 'SL' + '00' + employee_id ;
	   employee.status = "Active";
	   
	  
	   
	    var dir = './public/uploads/employeerecords/'+ employee.employee_id ;
	    
	    filessystem.mkdirSync(dir);
	    
			
		var dir2 = './public/uploads/employeerecords/'+ employee.employee_id + '/profile';
		
		filessystem.mkdirSync(dir2);
		
		
	    var	dir3 = '/uploads/employeerecords/'+ employee.employee_id + '/profile';
		
		 
		
		if(req.files.length > 0)
               {
	            for(var i = 0; i < req.files.length ;i++)
					 {
						 
					  fs.move('./public/uploads/employeerecords/' + req.files[i].filename , dir2 + '/' + req.files[i].filename , function (err) {
											 if (err) return console.error(err)
											 console.log("success!")
											});
					employee.photo = dir3 + '/' + req.files[i].filename;
					}
			   }
		
		
	    console.log(employee);
	     employee.save(function(err) {
              if(err) {
                console.log(err);
                res.render("../views/employees/create");
                } else {
                console.log("Successfully created an employee.");
				var country = require ('countries-cities').getCountries();
                
				Bank.find({}).exec(function (err, bank) {
                  if (err) {
                   console.log("Error:", err);	
                  }
				DocumentType.find({}).exec(function(err, documenttype){
				if(err){
						console.log("Error:",err);
					}
                else {
		        res.redirect("/employees");
			
 	              }
				});
                
				});
				}
			  
            });
	   });
	  

});

// Edit employee
router.get('/edit/:id', function(req, res) {
  employee.edit(req, res);
});

// Edit update
router.post('/update/:id',upload.any(), function(req,res,next) {
	
	var obj=cache.get('myjsonobj');
	
	
		
	
  Employee.findById(req.params.id, function(err, data) {

  console.log("emp",req.body);
  data.firstname = req.body.firstname;
  data.lastname = req.body.lastname;
  data.dateofbirth = req.body.dateofbirth;
  data.address = req.body.address;
  data.postalcode = req.body.postalcode;
  data.nationality = req.body.nationality;
  data.country = req.body.country;
  data.city = req.body.city;
  data.gender = req.body.gender;
  data.office = req.body.office;
  data.passportno = req.body.passportno;
  data.dateofjoining = req.body.dateofjoining;
  data.designation = req.body.designation;
  data.permitstatus = req.body.permitstatus;
  data.workstatus = req.body.workstatus;
  data.maritalstatus = req.body.maritalstatus;
  data.comment=req.body.comment;
  data.fathername = req.body.fathername;
  data.mothername = req.body.mothername;	
  data.spousename = req.body.spousename;
  data.noofkids = req.body.noofkids;
  data.mcontactno = req.body.mcountry_code + ' ' + req.body.mcontactno;
  data.econtactno = req.body.ecountry_code + ' ' + req.body.econtactno;
  data.fidno = req.body.fidno;
  data.employeementtype = req.body.emptype;        
       
	    
	    var dir2 = './public/uploads/employeerecords/'+ data.employee_id + '/profile';
			
	    var	dir3 = '/uploads/employeerecords/'+ data.employee_id + '/profile';
		
		 
		
		if(req.files.length > 0)
               {
	            for(var i = 0; i < req.files.length ;i++)
					 {
						 
					  fs.move('./public/uploads/employeerecords/' + req.files[i].filename , dir2 + '/' + req.files[i].filename , function (err) {
											 if (err) return console.error(err)
											 console.log("success!")
											});
					data.photo = dir3 + '/' + req.files[i].filename;
					}
			   }

  data.save(function(err, data) {
        if (err) {
          return next(err);
        }
       else {
                console.log("Successfully created an employee.");
				var country = require ('countries-cities').getCountries();
                Employee.find({}).exec(function (err, employees) {
                  if (err) {
                   console.log("Error:", err);	
                  }
				Bank.find({}).exec(function (err, bank) {
                  if (err) {
                   console.log("Error:", err);	
                  }
				DocumentType.find({}).exec(function(err, documenttype){
				if(err){
						console.log("Error:",err);
					}
                else {
				    res.redirect("/employees");
 	              }
				});
                });
				});
				}
      });
    });
  });


// Edit update
router.post('/inactive/:id', function(req, res, next) {
  employee.inactive(req, res);
});

router.get('/returncity', function(req, res, next) {
   var country_name = req.query.country_name;
   
   var cities = require ('countries-cities').getCities(country_name); 
   
   res.send(cities);
   
});



router.post('/addvisaemp',upload.any(),function(req, res, next){
	
	console.log("start");
	console.log(req.body.id1);
	console.log(req.files);
	
	var dir = './public/uploads/employeerecords/'+ req.body.id1 ;
	    
	    if (!fs.existsSync(dir))
		 filessystem.mkdirSync(dir);
	
	if(req.files.length>0){
		console.log("start insert1");
	  var dir1 = './public/uploads/employeerecords/'+ req.body.id1 + '/visadocuments';
	    
	 if (!fs.existsSync(dir1))
	 filessystem.mkdirSync(dir1);
	 
	 fs.move('./public/uploads/employeerecords/' + req.files[0].filename , dir1 + '/' + req.files[0].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
							
	}
	
	 mongoose.connection.db.collection("counters").findAndModify( { _id: 'visaempid' }, null, { $inc: { sequence_value: 1 } }, function(err, result){
        if(err) console.log("Error:",err);
	         visaemp_id = result.value.sequence_value;
			 console.log("body",req.body);
			 var visaemp = new VisaEmp(req.body);
			 visaemp.visaemp_id = visaemp_id;
			 visaemp.country = req.body.vcountry;
			 visaemp.expirydate = req.body.expirydate;
			 visaemp.visatype = req.body.visatype;
			 visaemp.status = "Active";
			 visaemp.employee_id = req.body.id1;
			 
			 if(req.files.length>0){
			 visaemp.filename = req.files[0].filename;
			 var filepath = '/uploads/employeerecords/'+ req.body.id1 + '/visadocuments' + '/' + req.files[0].filename;
			 visaemp.filepath = filepath;
			
			 }
			 else{
				 
			 visaemp.filename = "";
			 visaemp.filepath = "";
			 }
			
			console.log("visa object",visaemp);	

             var objvisaemp = {};
			 objvisaemp['visaemp'] = visaemp;
			 cache.put('myjsonobj2', objvisaemp);			
			 visaemp.save(function(err) {
				  if(err) {
                      console.log(err);
                    }
				 else {
				   cache.del('myjsonobj');
		           VisaEmp.find({status:'Active',employee_id:req.body.id1}).exec(function (err, visaemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
				     console.log(visaemp);
   					 res.send(visaemp);
					 }); 
	              }
                });
					 
				   
			 
			 
	        });
	 
});

router.get('/returnvisaemp', function(req, res, next) {
   var employee_id = req.query.employee_id;
   
   VisaEmp.find({status:'Active',employee_id:req.query.employee_id}).exec(function (err, visaemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   
   
   res.send(visaemp);
   }); 
});

router.get('/inactivevisa/:id', function(req, res, next) {
  
  
  console.log("start");
  console.log(req.params.id);
  
  
   VisaEmp.findById({_id:req.params.id}).exec(function (err, visaemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   visaemp.status='Inactive';
   console.log(visaemp);
   visaemp.save(function(err, data) {
        if (err) {
          console.log("Error:", err);
        }
	 
        else {
          console.log("Visa Inactive/Active!");
		  
		  
          VisaEmp.find({status:'Active',employee_id:visaemp.employee_id}).exec(function (err, visaemp) {
			 
                  console.log(visaemp);
				  if (err) {
                   console.log("Error:", err);
                  }
                  else {
		           res.send(visaemp);
	              }
                });
    }
  });
 });
});



router.post('/adddocemp',upload.any(),function(req, res, next){
	var obj=cache.get('myjsonobj');
	console.log("start");
	console.log(req.body.id3);
	console.log(req.files);
	
	if(req.files.length>0){
		
		 
		 
		var dir = './public/uploads/employeerecords/'+ req.body.id3 ;
	    
	    if (!fs.existsSync(dir))
		 filessystem.mkdirSync(dir);
	    
		 
		 var dir1 = './public/uploads/employeerecords/'+ req.body.id3 + '/Passport';
		 
		 if (!fs.existsSync(dir1))
		 filessystem.mkdirSync(dir1);
	 
		 var dir2 = './public/uploads/employeerecords/'+ req.body.id3 + '/CDC';
		 if (!fs.existsSync(dir2))
		 filessystem.mkdirSync(dir2);
	 
		 var dir3 = './public/uploads/employeerecords/'+ req.body.id3 + '/CV';
		 if (!fs.existsSync(dir3))
		 filessystem.mkdirSync(dir3);
	 
		 var dir4 = './public/uploads/employeerecords/'+ req.body.id3 + '/Appraisal';
		 if (!fs.existsSync(dir4))
		 filessystem.mkdirSync(dir4);
	 
		 var dir5 = './public/uploads/employeerecords/'+ req.body.id3 + '/Interview Form';
		 if (!fs.existsSync(dir5))
		 filessystem.mkdirSync(dir5);
	 
		 var dir6 = './public/uploads/employeerecords/'+ req.body.id3 + '/Certificates';
		 if (!fs.existsSync(dir6))
		 filessystem.mkdirSync(dir6);
	 
		 var dir7 = './public/uploads/employeerecords/'+ req.body.id3 + '/IC';
		 if (!fs.existsSync(dir7))
		 filessystem.mkdirSync(dir7);
	 
	    
	 
		 var documenttype = getValueByKey(req.body.documenttype,obj.documenttype);
		 
		 console.log(documenttype);
	     
		 if(documenttype == "Attachment Of IC"){
		     
		      for(var i = 0; i < req.files.length ;i++){
				  console.log("inside");
				  console.log(req.files.length);
					
					fs.move('./public/uploads/employeerecords/' + req.files[i].filename , dir7 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
					
				    var docemp = {employee_id: req.body.id3, documenttype_id: req.body.documenttype,
                                  documentype: documenttype ,filename: req.files[i].filename,				
								  filepath: '/uploads/employeerecords/'+ req.body.id3 + '/IC' + '/' + req.files[i].filename,
								  status:'Active' ,typeofdoc: 'IC'};
								  
								  mongoose.connection.db.collection("documentemp").insert(docemp, function(err, result){
									  if(err){
										console.log("err",err);
									  }
								 
								});
			  }
		 }
		 
	     if(documenttype == "Attachment Of Passport"){
		     
		      for(var i = 0; i < req.files.length ;i++){
				  console.log("inside");
				  console.log(req.files.length);
					
					fs.move('./public/uploads/employeerecords/' + req.files[i].filename , dir1 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
					
				    var docemp = {employee_id: req.body.id3, documenttype_id: req.body.documenttype,
                                  documentype: documenttype ,filename: req.files[i].filename,				
								  filepath: '/uploads/employeerecords/'+ req.body.id3 + '/Passport' + '/' + req.files[i].filename,
								  status:'Active' ,typeofdoc: 'Passport'};
								  
								  mongoose.connection.db.collection("documentemp").insert(docemp, function(err, result){
									  if(err){
										console.log("err",err);
									  }
								 
								});
			  }
		 }
		 if(documenttype == "Attachment Of CDC"){
		     
		      for(var i = 0; i < req.files.length ;i++){
				  console.log("inside");
				  console.log(req.files.length);
					
					fs.move('./public/uploads/employeerecords/' + req.files[i].filename , dir2 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
					
				    var docemp = {employee_id: req.body.id3, documenttype_id: req.body.documenttype,
                                  documentype: documenttype ,filename: req.files[i].filename,				
								  filepath: '/uploads/employeerecords/'+ req.body.id3 + '/CDC' + '/' + req.files[i].filename,
								  status:'Active' ,typeofdoc: 'CDC'};
								  
								  mongoose.connection.db.collection("documentemp").insert(docemp, function(err, result){
									  if(err){
										console.log("err",err);
									  }
								  
								});
			  }
		 }
		 if(documenttype == "Attachment Of CV"){
		     
		      for(var i = 0; i < req.files.length ;i++){
				  console.log("inside");
				  console.log(req.files.length);
					
					fs.move('./public/uploads/employeerecords/' + req.files[i].filename , dir3 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
					
				    var docemp = {employee_id: req.body.id3, documenttype_id: req.body.documenttype,
                                  documentype: documenttype ,filename: req.files[i].filename,				
								  filepath: '/uploads/employeerecords/'+ req.body.id3 + '/CV' + '/' + req.files[i].filename,
								  status:'Active' ,typeofdoc: 'CV'};
								  
								  mongoose.connection.db.collection("documentemp").insert(docemp, function(err, result){
									  if(err){
										console.log("err",err);
									  }
								  
								});
			  }
		 }
		 if(documenttype == "Attachment Of Appraisal"){
		     
		      for(var i = 0; i < req.files.length ;i++){
				  console.log("inside");
				  console.log(req.files.length);
					
					fs.move('./public/uploads/employeerecords/' + req.files[i].filename , dir4 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
					
				    var docemp = {employee_id: req.body.id3, documenttype_id: req.body.documenttype,
                                  documentype: documenttype ,filename: req.files[i].filename,				
								  filepath: '/uploads/employeerecords/'+ req.body.id3 + '/Appraisal' + '/' + req.files[i].filename,
								  status:'Active' ,typeofdoc: 'Appraisal'};
								  
								  mongoose.connection.db.collection("documentemp").insert(docemp, function(err, result){
									  if(err){
										console.log("err",err);
									  }
								  
								});
			  }
		 }
		 if(documenttype == "Interview Form"){
		     
		      for(var i = 0; i < req.files.length ;i++){
				  
					
					fs.move('./public/uploads/employeerecords/' + req.files[i].filename , dir5 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
					
				    var docemp = {employee_id: req.body.id3, documenttype_id: req.body.documenttype,
                                  documentype: documenttype ,filename: req.files[i].filename,				
								  filepath: '/uploads/employeerecords/'+ req.body.id3 + '/Interview Form' + '/' + req.files[i].filename,
								  status:'Active' ,typeofdoc: 'Interview Form'};
								  
								  mongoose.connection.db.collection("documentemp").insert(docemp, function(err, result){
									  if(err){
										console.log("err",err);
									  }
								  
								});
			  }
		 }
		 if(documenttype == "Certificates"){
		     
		      for(var i = 0; i < req.files.length ;i++){
				  
					
					fs.move('./public/uploads/employeerecords/' + req.files[i].filename , dir6 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
					
				    var docemp = {employee_id: req.body.id3, documenttype_id: req.body.documenttype,
                                  documentype: documenttype ,filename: req.files[i].filename,				
								  filepath: '/uploads/employeerecords/'+ req.body.id3 + '/Certificates' + '/' + req.files[i].filename,
								  status:'Active' ,typeofdoc: 'Certificates'};
								  
								  mongoose.connection.db.collection("documentemp").insert(docemp, function(err, result){
									  if(err){
										console.log("err",err);
									  }
								  
								});
			  }
		 }
		  
		 DocumentEmp.find({status:'Active',employee_id:req.body.id3}).exec(function (err, docemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
				     console.log("Add",docemp);
   					 res.send(docemp);
					 });
	}
	
			 
			
});

router.get('/returndocemp', function(req, res, next) {
   var employee_id = req.query.employee_id;
   
   DocumentEmp.find({status:'Active',employee_id:req.query.employee_id}).exec(function (err, docemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   
   console.log("loading",docemp);
   res.send(docemp);
   }); 
});

router.get('/inactivedoc/:id', function(req, res, next) {
  
  
  console.log("start");
  console.log(req.params.id);
  
  
   DocumentEmp.findById({_id:req.params.id}).exec(function (err, docemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   docemp.status='Inactive';
   console.log(docemp);
   docemp.save(function(err, data) {
        if (err) {
          console.log("Error:", err);
        }
	 
        else {
          console.log("Document Inactive/Active!");
		  console.log(req.body.id3);
		  
          DocumentEmp.find({status:'Active',employee_id:docemp.employee_id}).exec(function (err, docemp) {
                  if (err) {
                   console.log("Error:", err);
                  }
                  else {
		           res.send(docemp);
	              }
                });
    }
  });
 });
});


router.post('/addbankemp',upload.any(),function(req, res, next){
	
	console.log("start");
	console.log(req.body.id5);
	console.log(req.body);
	
	var obj=cache.get('myjsonobj');
	
			 var bankemp = new BankEmp(req.body);
			 bankemp.employee_id = req.body.id5;
			 bankemp.bankname_id = req.body.bankname;
			 bankemp.bankname = getValueByKey(req.body.bankname,obj.bank);
			 if(bankemp.bankname == "Others"){
				bankemp.bankname = "Others" + '/' + req.body.bankotherfield1; 
			 }
			 bankemp.address = req.body.baddress;
			 bankemp.scode = req.body.scode;
			 bankemp.ifsccode = req.body.ifsccode;
			 bankemp.accountno= req.body.accountno;
			 bankemp.status = "Active";
			 
			 
			 
			console.log("bank object",bankemp);	

            		
			 bankemp.save(function(err) {
				  if(err) {
                      console.log(err);
                    }
				 else {
				   
		           BankEmp.find({status:'Active',employee_id:req.body.id5}).exec(function (err, bankemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
				     console.log(bankemp);
   					 res.send(bankemp);
					 }); 
	              }
                });
					 
				   
			 
			 
	        
	 
});

router.get('/returnbankemp', function(req, res, next) {
   var employee_id = req.query.employee_id;
   
   BankEmp.find({status:'Active',employee_id:req.query.employee_id}).exec(function (err, bankemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   
   
   res.send(bankemp);
   }); 
});

router.get('/inactivebank/:id', function(req, res, next) {
  
  
  console.log("start");
  console.log(req.params.id);
  
  
   BankEmp.findById({_id:req.params.id}).exec(function (err, bankemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   bankemp.status='Inactive';
   console.log(bankemp);
   bankemp.save(function(err, data) {
        if (err) {
          console.log("Error:", err);
        }
	 
        else {
          console.log("Bank Inactive/Active!");
		  console.log(req.body.id5);
		  
          BankEmp.find({status:'Active',employee_id:bankemp.employee_id}).exec(function (err, bankemp) {
                  if (err) {
                   console.log("Error:", err);
                  }
                  else {
		           res.send(bankemp);
	              }
                });
        }
  });
 });
});

router.post('/addpayslipemp',upload.any(),function(req, res, next){
	
	console.log("start");
	console.log(req.body.id7);
	console.log(req.body);
	
	
	var dir = './public/uploads/employeerecords/'+ req.body.id7 ;
	    
	     if (!fs.existsSync(dir))
		 filessystem.mkdirSync(dir);
	 
	if(req.files.length>0){
		console.log("start insert1");
	  var dir1 = './public/uploads/employeerecords/'+ req.body.id7 + '/payslips';
	    
	 if (!fs.existsSync(dir1))
	 filessystem.mkdirSync(dir1);
	 console.log(dir1);
	 
	 fs.move('./public/uploads/employeerecords/' + req.files[0].filename , dir1 + '/' + req.files[0].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
							
	}
	
			 var payslipemp = new PayslipEmp(req.body);
			 payslipemp.employee_id = req.body.id7;
			 payslipemp.year = req.body.year;
			 
			 
			 if(req.files.length>0){
			 payslipemp.filename = req.files[0].filename;
			 var filepath = '/uploads/employeerecords/'+ req.body.id7 + '/payslips' + '/' + req.files[0].filename;
			 payslipemp.filepath = filepath;
			
			 
			
			 }
			 else{
				 
			 payslipemp.filename = "";
			 payslipemp.filepath = "";
			 }
			 
			 
			
			 payslipemp.month = req.body.month;
			 
			 payslipemp.status = "Active";
			 
			 
			 
			console.log("payslipemp object",payslipemp);	

                      

			
			 payslipemp.save(function(err) {
				  if(err) {
                      console.log(err);
                    }
				 else {
				   
		          PayslipEmp.find({status:'Active',employee_id:payslipemp.employee_id}).exec(function (err, payslipemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
				     console.log(payslipemp);
   					 res.send(payslipemp);
					 }); 
	              }
                });
					 
				   
			 
			 
	        
	 
});

router.get('/returnpayslipemp', function(req, res, next) {
   var employee_id = req.query.employee_id;
   var year = req.query.year;
  
   
   if(year == ''){
   
   PayslipEmp.find({status:'Active',employee_id:req.query.employee_id}).exec(function (err, payslipemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   
   console.log("a",payslipemp);
   res.send(payslipemp);
   });
}
else
{
	PayslipEmp.find({status:'Active',year:year,employee_id:req.query.employee_id}).exec(function (err, payslipemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   
   console.log("b",payslipemp);
   res.send(payslipemp);
   });
}	
});

router.get('/inactivepayslip/:id', function(req, res, next) {
  
  
  console.log("start");
  console.log(req.params.id);
  
  
   PayslipEmp.findById({_id:req.params.id}).exec(function (err, payslipemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   payslipemp.status='Inactive';
   console.log(payslipemp);
   payslipemp.save(function(err, data) {
        if (err) {
          console.log("Error:", err);
        }
	 
        else {
          console.log("payslipemp Inactive/Active!");
		  console.log(req.body.id7);
		  
          PayslipEmp.find({status:'Active',employee_id:payslipemp.employee_id}).exec(function (err, payslipemp) {
                  if (err) {
                   console.log("Error:", err);
                  }
                  else {
		           res.send(payslipemp);
	              }
                });
        }
  });
 });
});

router.get('/fetchbankemp/:id', function(req, res, next) {
	
    BankEmp.findById({_id:req.params.id}).exec(function (err, bankemp) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   
   console.log(bankemp);
   res.send(bankemp);
   }); 
});

router.post('/editbankemp/:id',upload.any(), function(req, res, next) {
 
  
 var obj=cache.get('myjsonobj');
 
    
   BankEmp.findById(req.params.id, function(err, data) {
    
    data.bankname_id = req.body.bankname;
    data.bankname = getValueByKey(req.body.bankname,obj.bank);
	if(data.bankname == "Others"){
				data.bankname = "Others" + '/' + req.body.bankotherfield1; 
			 }
    data.address = req.body.baddress;
    data.scode = req.body.scode;
    data.ifsccode = req.body.ifsccode;
	
    data.accountno = req.body.accountno;
  	console.log(data);		
   
    data.save(function(err, data) {
        if (err) {
          console.log("Error:", err);
        }
	 
        else {
          console.log("BankEmp Inactive/Active!");
		  
		  
          BankEmp.find({status:'Active',employee_id:data.employee_id}).exec(function (err, bankemp) {
			 
                  console.log(bankemp);
				  if (err) {
                   console.log("Error:", err);
                  }
                  else {
		           res.send(bankemp);
	              }
                });
    }
  });
 });
});


module.exports = router;
