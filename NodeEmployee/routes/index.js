var u = require('underscore');
var express = require('express');
var router = express.Router();
var JobAssignment = require("../models/JobAssignment");
var VdrAnalysis = require("../models/VdrAnalysis");
var mongoose = require('mongoose');
/* GET home page. */
router.get('/', function(req, res, next) {
	 mongoose.connection.db.collection("year").find({}).toArray(function(err, year){
     if(err) console.log("Error:",err);
	 res.render('dashboard', { year:year });
	 });
});

router.get('/employee', function(req, res, next) {
  res.render('employee', { title: 'Express' });
});


router.get('/d3vdrsample', function(req, res, next) {
  var jsonData;
	VdrAnalysis.find({}).exec(function (err, vdranalysiss) {
	
    if (err) {
      console.log("Error:", err);
    }
    else {
		
	  jsonData = JSON.parse(JSON.stringify(vdranalysiss));
	  
    }
  var jsonSingle = {};
  var jsonRes = [];
  u.map(jsonData, function(item){
	 var newinserteddt = new Date(item.inserted_at);
     var dd = newinserteddt.getDate();
     var month = newinserteddt.getMonth()+1; //January is 0!
     var yyyy = newinserteddt.getFullYear();
     var year = yyyy.toString().substr(-2);
	 
  
    item.year = year; 
    item.quarter = getQuarter(month, year); 
    item.month = month + '-' + year; 
  });
 
  u.chain(jsonData)
      .groupBy("status","year")
      .map(function(value, key){
          var yearWise = {};
		  yearWise.year = key;
          yearWise.yearCount = u.size(value).toString();
          yearWise.quarterlist = [];
          u.chain(value)
            .groupBy("status","quarter")
            .map(function(quarterData, quarterName){
              var qdata = {};
              qdata.quarter = quarterName;
              qdata.quarterCount = u.size(quarterData).toString();
              qdata.monthlist = [];
              u.chain(quarterData)
                .groupBy("status","month")
                .map(function(monthData, monthName){
                  var mdata = {};
                  mdata.month = monthName;
                  mdata.monthCount = u.size(monthData).toString();
                  qdata.monthlist.push(mdata);
                });
                yearWise.quarterlist.push(qdata);
              });
          jsonRes.push(yearWise);
        });
  
  res.send(JSON.stringify(jsonRes));
	});
});

router.get('/d3vdrsample/withparam/:datetime', function(req, res, next) {
  var jsonData;
	VdrAnalysis.find({}).exec(function (err, vdranalysiss) {
	
    if (err) {
      console.log("Error:", err);
    }
    else {
		
	  jsonData = JSON.parse(JSON.stringify(vdranalysiss));
	  
    }
   
 
  var datetime= req.params.datetime.substring(0, req.params.datetime.indexOf(" "));
  var type = req.params.datetime.substring(req.params.datetime.indexOf(" ")+1);
 
 console.log("datetime",datetime);
 console.log("type",type);
  var jsonSingle = {};
  var jsonRes = [];
  u.map(jsonData, function(item){
	 var newinserteddt = new Date(item.inserted_at);
     var dd = newinserteddt.getDate();
     var month = newinserteddt.getMonth()+1; //January is 0!
     var yyyy = newinserteddt.getFullYear();
     var year = yyyy.toString().substr(-2);
	 
   
    item.year = yyyy; 
    item.quarter = getQuarter(month, yyyy); 
    item.month = month + '-' + yyyy; 
	
	
  });
  var my_json = JSON.stringify(jsonData)
  console.log("1");
  var filtered_json;
  
  if(type=="Month"){
	  console.log("2");
	  filtered_json = find_in_object(JSON.parse(my_json), {month: datetime});
  }
  else if(type=="Year"){
	  filtered_json = find_in_object(JSON.parse(my_json), {year: datetime});
  }
  else if(type=="Quarter")
	  filtered_json = find_in_object(JSON.parse(my_json), {quarter: datetime});
  
 
 
  console.log(filtered_json);
  // console.log(jsonData);
  u.chain(filtered_json)
      .groupBy("status")
	  .map(function(value, key){
          var yearWise = {};
          yearWise.year = key;
          yearWise.yearCount = u.size(value).toString();
          yearWise.quarterlist = [];
		  
		  
          u.chain(value)
            .groupBy("year")
			.map(function(quarterData, quarterName){
              var qdata = {};
              qdata.quarter = quarterName;
              qdata.quarterCount = u.size(quarterData).toString();
              qdata.monthlist = [];
              
                yearWise.quarterlist.push(qdata);
              });
          jsonRes.push(yearWise);
		  console.log(yearWise);
        });
  
  
  
  res.send(JSON.stringify(jsonRes));
	});
});

router.get('/d3jobsample/withparam/:datetime', function(req, res, next) {
  var jsonData;
	JobAssignment.find({}).exec(function (err, jobassignments) {
	
    if (err) {
      console.log("Error:", err);
    }
    else {
		
	  jsonData = JSON.parse(JSON.stringify(jobassignments));
	  
    }
   
 
  var datetime= req.params.datetime.substring(0, req.params.datetime.indexOf(" "));
  var type = req.params.datetime.substring(req.params.datetime.indexOf(" ")+1);
 
 console.log("datetime",datetime);
 console.log("type",type);
  var jsonSingle = {};
  var jsonRes = [];
  u.map(jsonData, function(item){
	 var newinserteddt = new Date(item.inserted_at);
     var dd = newinserteddt.getDate();
     var month = newinserteddt.getMonth()+1; //January is 0!
     var yyyy = newinserteddt.getFullYear();
     var year = yyyy.toString().substr(-2);
	 
   
    item.year = yyyy; 
    item.quarter = getQuarter(month, yyyy); 
    item.month = month + '-' + yyyy; 
	
	
  });
  var my_json = JSON.stringify(jsonData);
  console.log("1");
  var filtered_json;
  
  if(type=="Month"){
	  console.log("2");
	  filtered_json = find_in_object(JSON.parse(my_json), {month: datetime});
  }
  else if(type=="Year"){
	  filtered_json = find_in_object(JSON.parse(my_json), {year: datetime});
  }
  else if(type=="Quarter")
	  filtered_json = find_in_object(JSON.parse(my_json), {quarter: datetime});
  
 
 
  console.log(filtered_json);
  // console.log(jsonData);
  u.chain(filtered_json)
      .groupBy("vesselschedule")
	  .map(function(value, key){
          var yearWise = {};
          yearWise.year = key;
          yearWise.yearCount = u.size(value).toString();
          yearWise.quarterlist = [];
		  
		  
          u.chain(value)
            .groupBy("year")
			.map(function(quarterData, quarterName){
              var qdata = {};
              qdata.quarter = quarterName;
              qdata.quarterCount = u.size(quarterData).toString();
              qdata.monthlist = [];
              
                yearWise.quarterlist.push(qdata);
              });
          jsonRes.push(yearWise);
		  console.log(yearWise);
        });
  
  
  
  res.send(JSON.stringify(jsonRes));
	});
});

function find_in_object(my_object, my_criteria){

  return my_object.filter(function(obj) {
    return Object.keys(my_criteria).every(function(c) {
      return obj[c] == my_criteria[c];
    });
  });

}

router.get('/d3jobsample', function(req, res, next) {
  var jsonData;
	JobAssignment.find({}).exec(function (err, jobassignments) {
	
    if (err) {
      console.log("Error:", err);
    }
    else {
		
	  jsonData = JSON.parse(JSON.stringify(jobassignments));
	  
    }
  var jsonSingle = {};
  var jsonRes = [];
  u.map(jsonData, function(item){
	 var newinserteddt = new Date(item.inserted_at);
     var dd = newinserteddt.getDate();
     var month = newinserteddt.getMonth()+1; //January is 0!
     var yyyy = newinserteddt.getFullYear();
     var year = yyyy.toString().substr(-2);
	 
   
    item.year = yyyy; 
    item.quarter = getQuarter(month, yyyy); 
    item.month = month + '-' + yyyy; 
	
  });
  // console.log(jsonData);
  u.chain(jsonData)
      .groupBy("vesselschedule","year")
      .map(function(value,key){
		  var yearWise = {};
          yearWise.year = key;
          yearWise.yearCount = u.size(value).toString();
          yearWise.quarterlist = [];
          u.chain(value)
            .groupBy("vesselschedule","quarter")
            .map(function(quarterData, quarterName){
				
              var qdata = {};
              qdata.quarter = quarterName;
              qdata.quarterCount = u.size(quarterData).toString();
              qdata.monthlist = [];
              u.chain(quarterData)
                .groupBy("vesselschedule","month")
                .map(function(monthData, monthName){
                  var mdata = {};
                  mdata.month = monthName;
                  mdata.monthCount = u.size(monthData).toString();
                  qdata.monthlist.push(mdata);
                });
                yearWise.quarterlist.push(qdata);
              });
          jsonRes.push(yearWise);
        });
  
  res.send(JSON.stringify(jsonRes));
	});
});



function getQuarter(month, year){
	
  if(month == '1' || month == '2' || month == '3'){
    return "Q1-" + year;
  }
  if(month == '4' || month == '5' || month == '6'){
    return "Q2-" + year;
  }
  if(month == '7' || month == '8' || month == '9'){
    return "Q3-" + year;
  }
  if(month == '10' || month == '11' || month == '12'){
    return "Q4-" + year;
  }
}

router.get('/d3vdrKPI', function(req, res, next) {
    var jsonData;
	VdrAnalysis.find({}).exec(function (err, vdranalysiss) {
	
    if (err) {
      console.log("Error:", err);
    }
    else {
		
	  jsonData = JSON.parse(JSON.stringify(vdranalysiss));
	  
    }
	

	
  var jsonSingle = {};
  var jsonRes = [];
  u.map(jsonData, function(item){
	 var newinserteddt = new Date(item.inserted_at);
     var dd = newinserteddt.getDate();
     var month = newinserteddt.getMonth()+1; //January is 0!
     var yyyy = newinserteddt.getFullYear();
     var year = yyyy.toString().substr(-2);
	
if(item.dayscount>0)
   item.duestatus="Overdue";
else
   item.duestatus="Due";	
    
    item.year = year; 
    item.quarter = getQuarter(month, year); 
    item.month = month + '-' + year; 
  });
 
  u.chain(jsonData)
      .groupBy("duestatus","year")
      .map(function(value, key){
          var yearWise = {};
		  yearWise.year = key;
          yearWise.yearCount = u.size(value).toString();
          yearWise.quarterlist = [];
          u.chain(value)
            .groupBy("duestatus","quarter")
            .map(function(quarterData, quarterName){
              var qdata = {};
              qdata.quarter = quarterName;
              qdata.quarterCount = u.size(quarterData).toString();
              qdata.monthlist = [];
              u.chain(quarterData)
                .groupBy("duestatus","month")
                .map(function(monthData, monthName){
                  var mdata = {};
                  mdata.month = monthName;
                  mdata.monthCount = u.size(monthData).toString();
                  qdata.monthlist.push(mdata);
                });
                yearWise.quarterlist.push(qdata);
              });
          jsonRes.push(yearWise);
        });
  
  res.send(JSON.stringify(jsonRes));
	});
});

router.get('/d3jobKPI', function(req, res, next) {
    var jsonData;
	JobAssignment.find({}).exec(function (err, jobassignments) {
	
    if (err) {
      console.log("Error:", err);
    }
    else {
		
	  jsonData = JSON.parse(JSON.stringify(jobassignments));
	  
    }
	

	
  var jsonSingle = {};
  var jsonRes = [];
  u.map(jsonData, function(item){
	 var newinserteddt = new Date(item.inserted_at);
     var dd = newinserteddt.getDate();
     var month = newinserteddt.getMonth()+1; //January is 0!
     var yyyy = newinserteddt.getFullYear();
     var year = yyyy.toString().substr(-2);
	
if(item.dayscount>0)
   item.duestatus="Overdue";
else
   item.duestatus="Due";	
    
    item.year = year; 
    item.quarter = getQuarter(month, year); 
    item.month = month + '-' + year; 
  });
 
  u.chain(jsonData)
      .groupBy("duestatus","year")
      .map(function(value, key){
          var yearWise = {};
		  yearWise.year = key;
          yearWise.yearCount = u.size(value).toString();
          yearWise.quarterlist = [];
          u.chain(value)
            .groupBy("duestatus","quarter")
            .map(function(quarterData, quarterName){
              var qdata = {};
              qdata.quarter = quarterName;
              qdata.quarterCount = u.size(quarterData).toString();
              qdata.monthlist = [];
              u.chain(quarterData)
                .groupBy("duestatus","month")
                .map(function(monthData, monthName){
                  var mdata = {};
                  mdata.month = monthName;
                  mdata.monthCount = u.size(monthData).toString();
                  qdata.monthlist.push(mdata);
                });
                yearWise.quarterlist.push(qdata);
              });
          jsonRes.push(yearWise);
        });
  
  res.send(JSON.stringify(jsonRes));
	});
});

router.get('/d3vdrKPI/withparam/:datetime', function(req, res, next) {
  var jsonData;
	VdrAnalysis.find({}).exec(function (err, vdranalysiss) {
	
    if (err) {
      console.log("Error:", err);
    }
    else {
		
	  jsonData = JSON.parse(JSON.stringify(vdranalysiss));
	  
    }
   
 
  var datetime= req.params.datetime.substring(0, req.params.datetime.indexOf(" "));
  var type = req.params.datetime.substring(req.params.datetime.indexOf(" ")+1);
 
 console.log("datetime",datetime);
 console.log("type",type);
  var jsonSingle = {};
  var jsonRes = [];
  u.map(jsonData, function(item){
	 var newinserteddt = new Date(item.inserted_at);
     var dd = newinserteddt.getDate();
     var month = newinserteddt.getMonth()+1; //January is 0!
     var yyyy = newinserteddt.getFullYear();
     var year = yyyy.toString().substr(-2);
	 if(item.dayscount>0)
	   item.duestatus="Overdue";
	 else
	   item.duestatus="Due";
   
    item.year = yyyy; 
    item.quarter = getQuarter(month, yyyy); 
    item.month = month + '-' + yyyy; 
	
	
  });
  var my_json = JSON.stringify(jsonData);
  console.log("1");
  var filtered_json;
  
  if(type=="Month"){
	  console.log("2");
	  filtered_json = find_in_object(JSON.parse(my_json), {month: datetime});
  }
  else if(type=="Year"){
	  filtered_json = find_in_object(JSON.parse(my_json), {year: datetime});
  }
  else if(type=="Quarter")
	  filtered_json = find_in_object(JSON.parse(my_json), {quarter: datetime});
  
 
 
  console.log(filtered_json);
  // console.log(jsonData);
  u.chain(filtered_json)
      .groupBy("duestatus")
	  .map(function(value, key){
          var yearWise = {};
          yearWise.year = key;
          yearWise.yearCount = u.size(value).toString();
          yearWise.quarterlist = [];
		  
		  
          u.chain(value)
            .groupBy("year")
			.map(function(quarterData, quarterName){
              var qdata = {};
              qdata.quarter = quarterName;
              qdata.quarterCount = u.size(quarterData).toString();
              qdata.monthlist = [];
              
                yearWise.quarterlist.push(qdata);
              });
          jsonRes.push(yearWise);
		  console.log(yearWise);
        });
  
  
  
  res.send(JSON.stringify(jsonRes));
	});
});

router.get('/d3jobKPI/withparam/:datetime', function(req, res, next) {
  var jsonData;
	JobAssignment.find({}).exec(function (err, jobassignments) {
	
    if (err) {
      console.log("Error:", err);
    }
    else {
		
	  jsonData = JSON.parse(JSON.stringify(jobassignments));
	  
    }
   
 
  var datetime= req.params.datetime.substring(0, req.params.datetime.indexOf(" "));
  var type = req.params.datetime.substring(req.params.datetime.indexOf(" ")+1);
 
 console.log("datetime",datetime);
 console.log("type",type);
  var jsonSingle = {};
  var jsonRes = [];
  u.map(jsonData, function(item){
	 var newinserteddt = new Date(item.inserted_at);
     var dd = newinserteddt.getDate();
     var month = newinserteddt.getMonth()+1; //January is 0!
     var yyyy = newinserteddt.getFullYear();
     var year = yyyy.toString().substr(-2);
	 
	  if(item.dayscount>0)
	   item.duestatus="Overdue";
	 else
	   item.duestatus="Due";
   
    item.year = yyyy; 
    item.quarter = getQuarter(month, yyyy); 
    item.month = month + '-' + yyyy; 
	
	
  });
  var my_json = JSON.stringify(jsonData);
  console.log("1");
  var filtered_json;
  
  if(type=="Month"){
	  console.log("2");
	  filtered_json = find_in_object(JSON.parse(my_json), {month: datetime});
  }
  else if(type=="Year"){
	  filtered_json = find_in_object(JSON.parse(my_json), {year: datetime});
  }
  else if(type=="Quarter")
	  filtered_json = find_in_object(JSON.parse(my_json), {quarter: datetime});
  
 
 
  console.log(filtered_json);
  // console.log(jsonData);
  u.chain(filtered_json)
      .groupBy("duestatus")
	  .map(function(value, key){
          var yearWise = {};
          yearWise.year = key;
          yearWise.yearCount = u.size(value).toString();
          yearWise.quarterlist = [];
		  
		  
          u.chain(value)
            .groupBy("year")
			.map(function(quarterData, quarterName){
              var qdata = {};
              qdata.quarter = quarterName;
              qdata.quarterCount = u.size(quarterData).toString();
              qdata.monthlist = [];
              
                yearWise.quarterlist.push(qdata);
              });
          jsonRes.push(yearWise);
		  console.log(yearWise);
        });
  
  
  
  res.send(JSON.stringify(jsonRes));
	});
});

module.exports = router;
