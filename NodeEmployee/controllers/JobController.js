var mongoose = require("mongoose");

var JobType = require("../models/JobType");

var jobController = {};

jobController.list = function(req, res) {
  JobType.find({}).exec(function (err, jobtypes) {
	  console.log("job type",jobtypes);
    if (err) {
      console.log("Error:", err);
    }
    else {
	  res.render("../views/jobs/index", {jobtypes: jobtypes});
    }
  });
};


jobController.delete = function(req, res) {
  JobType.remove({_id: req.params.id}, function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("JobType deleted!");
      JobType.find({}).exec(function (err, jobtypes) {
                  if (err) {
                   console.log("Error:", err);
                  }
                  else {
		           res.render("../views/jobs/index", {jobtypes: jobtypes});
	              }
                });
    }
  });
};

module.exports = jobController;