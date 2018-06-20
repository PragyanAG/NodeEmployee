var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var client = require("../controllers/ClientController.js");
var path = require('path');
var multer  =   require('multer');
var path = require('path');
var cache = require('memory-cache');
var Client = require("../models/Client");
var fs = require('fs-extra')
var filessystem = require('fs');
var ClientContact = require("../models/ClientContact");
var UploadDocument = require("../models/UploadDocument");

// file upload destination folder
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/clientdocuments');
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

function getValueByKey(key, data) {
   for (i in data) {
		 if (data[i]._id == key) {
            return data[i].name;
        }
    }
}

// Get all client
router.get('/', function(req, res) {
  client.list(req, res);
});

// Get single client by id
router.get('/show/:id', function(req, res) {
  client.show(req, res);
});

// Create client
router.get('/create', function(req, res) {
  client.create(req, res);
});

// Save client
router.post('/save',upload.any(),function(req, res,next) {
	
	var obj=cache.get('myjsonobj');
	
	
	
    var client_id;
       
	   mongoose.connection.db.collection("counters").findAndModify( { _id: 'clientid' }, null, { $inc: { sequence_value: 1 } }, function(err, result){
        if(err) console.log("Error:",err);
	         client_id = result.value.sequence_value;
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

             client_id = 'CL' + year + mm + dd + client_id ;
             var client = new Client(req.body);
             client.client_id = client_id;
			 client.companyname = req.body.companyname;
			 client.address = req.body.address;
			 client.country = req.body.country;
			 client.city = req.body.city;
			 client.officeno = req.body.officeno;
			 client.website = req.body.website;
			 client.status = "Active";
			 
			 console.log(req.body);
			 
             if(req.body.id3 != ""){
				 console.log("start");
				 for (var i=1;i<=req.body.id3;i++){
					  if(req.body['myfieldid' + i]!=""){
						  console.log(req.body['myfieldid' + i]);
					    client.officeno.push(req.body['myfieldid' + i]);
					  }
					 console.log(client.officeno);
				 }
					 
				 
             }				 
			 
			 var dir = './public/uploads/clientdocuments/'+ client.client_id ;
			          
			 filessystem.mkdirSync(dir);
			 
			 var dir1 = './public/uploads/clientdocuments/'+ client.client_id +'/Proposal&Contract';
			 filessystem.mkdirSync(dir1);
			
			 
               client.save(function(err) {
				  if(err) {
                      console.log(err);
                      res.render("../views/clients/create");
                    }else {
						
						 if(req.files.length > 0)
			            {
						  for(var i = 0; i < req.files.length ;i++)
				           {
							  
							fs.move('./public/uploads/clientdocuments/' + req.files[i].filename , dir1 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
							  
							  var uploaddoc = {columnmap: client.client_id, document: req.files[i].filename, 
							  filepath: '/uploads/clientdocuments/'+ client.client_id + '/Proposal&Contract' + '/' + req.files[i].filename,
							  status:'Active' ,typeofdoc: 'Proposal/Contract'};
							  console.log(uploaddoc);
							  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
						      if(err){
						        console.log("err",err);
							  }
							  
							  });
						   }
					    }
						
						
						
						
					    
					  console.log("Successfully created a client.");
                      Client.find({}).exec(function (err, clients) {
                          if (err) {
                             console.log("Error:", err);
                             }
                          else {
							 cache.del('myjsonobj');
                             res.redirect("/clients");
                             }
                      });
                    }
			 });
	   });
      
});

router.post('/update/:id',upload.any(), function(req,res,next) {
	
  console.log("start");
  Client.findById(req.params.id, function(err, data) {	
  
  
  data.companyname=req.body.companyname;
  data.address = req.body.address;
  data.officeno = req.body.officeno;
  data.country = req.body.country;
  data.city = req.body.city;
  data.website = req.body.website;
  
  var dir1 = './public/uploads/clientdocuments/'+ data.client_id + '/Proposal&Contract' ;
 
 
	 if(req.body.id3 != ""){
				console.log(req.body.id3);
				 for (var i=1;i<=req.body.id3;i++){
					  if(req.body['myfieldid' + i]!=""){
						  console.log(req.body['myfieldid' + i]);
					    data.officeno.push(req.body['myfieldid' + i]);
					  }
					 console.log(data.officeno);
				 }
					 
				 
             }
  
  data.save(function(err, data) {
	  console.log("i am coming here");
        if (err) {
          return next(err);
        }
							   
			if(req.files.length > 0)
               {
	            for(var i = 0; i < req.files.length ;i++)
					 {
						 
					  fs.move('./public/uploads/clientdocuments/' + req.files[i].filename , dir1 + '/' + req.files[i].filename , function (err) {
											 if (err) return console.error(err)
											 console.log("success!")
											});
					  var uploaddoc = {columnmap: data.client_id, document: req.files[i].filename,
									   filepath: '/uploads/clientdocuments/'+ data.client_id + '/Proposal&Contract' + '/' + req.files[i].filename,
									   status: 'Active',typeofdoc: 'Proposal/Contract' };
					  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
						if(err){
						   console.log("err",err);
						}
					 });
					}
			   }
		
		
		
        Client.find({}).exec(function (err, clients) {
                  if (err) {
                   console.log("Error:", err);	
                  }
                  else {
				   cache.del('myjsonobj');
		           res.redirect("/clients");
	              }
                });
      });
    });
  });







// Edit client
router.get('/edit/:id', function(req, res) {
  client.edit(req, res);
});


// Edit update
router.post('/inactive/:id', function(req, res, next) {
  client.inactive(req, res);
});
router.get('/returncity', function(req, res, next) {
   var country_name = req.query.country_name;
   
   var cities = require ('countries-cities').getCities(country_name); 
   
   res.send(cities);
   
});

router.get('/returnclientcontact', function(req, res, next) {
   var client_id = req.query.client_id;
   
   ClientContact.find({status:'Active',client_id:req.query.client_id}).exec(function (err, clientcontact) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   
   
   res.send(clientcontact);
   }); 
});
router.get('/inactiveclientcontact/:id', function(req, res, next) {
  
  
  console.log("start");
  console.log(req.params.id);
  
  
   ClientContact.findById({_id:req.params.id}).exec(function (err, clientcontact) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   clientcontact.status='Inactive';
   console.log(clientcontact);
   clientcontact.save(function(err, data) {
        if (err) {
          console.log("Error:", err);
        }
	 
        else {
          console.log("clientcontact Inactive/Active!");
		  
		  
          ClientContact.find({status:'Active',client_id:clientcontact.client_id}).exec(function (err, clientcontact) {
			 
                  console.log(clientcontact);
				  if (err) {
                   console.log("Error:", err);
                  }
                  else {
		           res.send(clientcontact);
	              }
                });
    }
  });
 });
});

router.get('/fetchclientcontact/:id', function(req, res, next) {
	
    ClientContact.findById({_id:req.params.id}).exec(function (err, clientcontact) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   
   console.log(clientcontact);
   res.send(clientcontact);
   }); 
});

/*router.get('/download/:id', function(req, res, next) {
	
	
	 UploadDocument.findById({_id:req.params.id}).exec(function (err, uploaddocuments) {
                  if (err) {
                   console.log("Error:", err);	
                  }
   
   console.log(uploaddocuments);
	
    

	//var path = express.static(path.join(__dirname, 'public'))
	console.log(__dirname);
	var a = __dirname.substring(__dirname.lastIndexOf("/") + 1);
     //var file = __dirname + '' uploaddocuments.filepath;
   // var fileName = uploaddoc.fileName; 
	console.log("dr",a);
	//console.log(uploaddoc.filepath);
    //res.download(file);
   
   });	
});
*/

router.post('/editclientcontact/:id',upload.any(), function(req, res, next) {
  
  
 
  
   ClientContact.findById(req.params.id, function(err, data) {
   
    data.firstname = req.body.firstname;
    data.lastname = req.body.lastname;
    data.designation = req.body.designation;
    data.mobileno = req.body.mobileno;
    data.officeno = req.body.officeno;
	console.log(data.email);
    data.email = req.body.email;
  			console.log("number",req.body.id3); 
			 if(req.body.id3 != ""){
				 console.log("start");
				 for (var i=1;i<=req.body.id3;i++){
					  if(req.body['emailfield' + i]!=""){
					  data.email.push(req.body['emailfield' + i]);
					  }
					 console.log(data.email);
				 }
					 
				 
			 }		  
   
   data.save(function(err, data) {
        if (err) {
          console.log("Error:", err);
        }
	 
        else {
          console.log("clientcontact Inactive/Active!");
		  
		  
          ClientContact.find({status:'Active',client_id:data.client_id}).exec(function (err, clientcontact) {
			 
                  console.log(clientcontact);
				  if (err) {
                   console.log("Error:", err);
                  }
                  else {
		           res.send(clientcontact);
	              }
                });
    }
  });
 });
});

router.post('/addclientcontact',upload.any(),function(req, res, next){
	
	console.log("start");
	console.log(req.body.id1);
	
	
			 console.log("body",req.body);
			 var clientcontact = new ClientContact(req.body);
			 clientcontact.client_id = req.body.id1;
			 clientcontact.firstname = req.body.firstname;
			 clientcontact.lastname = req.body.lastname;
			 clientcontact.designation = req.body.designation;
			 clientcontact.mobileno = req.body.mobileno;
			 clientcontact.officeno = req.body.officeno;
			 clientcontact.email = req.body.email;
			 clientcontact.status = "Active";
			 
			 if(req.body.id3 != ""){
				 console.log("start");
				 for (var i=1;i<=req.body.id3;i++){
					  if(req.body['emailfield' + i]!=""){
					  clientcontact.email.push(req.body['emailfield' + i]);
					  }
					 console.log(clientcontact.email);
				 }
					 
				 
			 }		
			 
				
			 clientcontact.save(function(err) {
				  if(err) {
                      console.log(err);
                    }
				 else {
				  
		           ClientContact.find({status:'Active',client_id:req.body.id1}).exec(function (err, clientcontact) {
                  if (err) {
                   console.log("Error:", err);	
                  }
				     console.log(clientcontact);
   					 res.send(clientcontact);
					 }); 
	              }
                });
	
});

module.exports = router;
