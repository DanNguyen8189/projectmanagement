const express = require("express");

const Milestone = require("../models/milestone.js");

const router = express.Router();

router.post("/add", (req, res) => {
  var newMilestone = new Milestone(req.body);
  newMilestone.save(function(err, result){
    if (!err){
      res.status(201).send(result);
    }
    else{
      res.status(400).send(err.message);
    }
  });
});

module.exports = router;