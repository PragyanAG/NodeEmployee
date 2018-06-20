var mongoose = require("mongoose");
var Client = require("../models/Client");
var Country = require("../models/Country");
var Doc = require("../models/Doc");

var cache = require('memory-cache');
var obj = {};
var ClientContact = require("../models/ClientContact");
var clientController = {};

// Show list of client
clientController.list = function(req, res) {
  Client.find({}).exec(function (err, clients) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/clients/index", {clients: clients});
    }
  });
};

// Show clients by id
clientController.show = function(req, res) {
  Client.findOne({_id: req.params.id}).exec(function (err, client) {
    if (err) {
      console.log("Error:", err);
    }
  Doc.find({columnmap: client.client_id,status: 'Active'}).exec(function (err, listofdoc) {
    if (err) {
      console.log("Error:", err);
    }
    else {
		
	  res.render("../views/clients/show", {client: client,listofdoc: listofdoc});
    }
  });
  });
};

// Create new Client
clientController.create = function(req, res) {
	
	var country = require ('countries-cities').getCountries();	
    	
	var phonecode = cache.get('objPhoneCode');
	
	
    res.render("../views/clients/create",{country:country,phonecode:phonecode});
	
};


// Edit an client
clientController.edit = function(req, res) {
 
  Client.findOne({_id: req.params.id}).exec(function (err, client) {
    if (err) {
      console.log("Error:", err);
    }
  
	else{
		
		 ClientContact.find({client_id: client.client_id}).exec(function(err, clientcontact) {
		  if(err){
			console.log("Error:", err);
		  }
		
         Doc.find({columnmap: client.client_id}, function(err, listofdoc){
	          if(err){
	             console.log("err",err);
	          }
        var country = require ('countries-cities').getCountries();
	    var phonecode = cache.get('objPhoneCode');
    
		 
         res.render("../views/clients/edit", {client: client, listofdoc: listofdoc,country: country,phonecode:phonecode,
		                                      clientcontact:clientcontact});
		  });
		 });
	}
		 
		  
   
   });
  
};

function getValueByKey(key, data) {
   for (i in data) {
		 if (data[i]._id == key) {
            return data[i].name;
        }
    }
}
// inactive a Client
clientController.inactive = function(req, res) {
	
	 Client.findById(req.params.id, function(err, data) {	
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
	
	 
	var myquery = { columnmap: data.client_id };
	var myquery1 = { client_id: data.client_id };
    
    mongoose.connection.db.collection("uploaddocuments").updateMany(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log(res.result.nModified + " document(s) updated");
    
  });
  
    mongoose.connection.db.collection("clientcontact").updateMany(myquery1, newvalues, function(err, res) {
    if (err) throw err;
    console.log(res.result.nModified + " contact(s) updated");
    
  });
	 data.save(function(err, data) {
        if (err) {
          console.log("Error:", err);
        }
	 
        else {
          console.log("Client Inactive/Active!");
          Client.find({}).exec(function (err, clients) {
                  if (err) {
                   console.log("Error:", err);
                  }
                  else {
		           res.render("../views/clients/index", {clients: clients});
	              }
                });
    }
  });
	 });
};



module.exports = clientController;
