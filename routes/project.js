const express = require("express");

const Project = require("../models/project.js");
const Milestone = require("../models/milestone.js");

const router = express.Router();

router.get("/", (req, res) => {
  let filter = {};
  if (req.query.filter){
    filter = JSON.parse(req.query.filter);
  }
  Project.find(filter).exec(function(err, result) {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(400).send(err.message);
    }
  });
});

router.get("/:id", (req, res) => {
  Project.findById(req.params.id, function(err, result) {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(400).send(err.message);
    }
  });
});

router.post("/add", (req, res) => {
  var newProject = new Project(req.body);
  //var newMilestones = new Milestone(req.body.milestones);
  newProject.save(function(err, result){
    if (!err){
      res.status(201).send(result);
    }
    else{
      res.status(400).send(err.message);
    }
  });
});

router.put("/edit", (req, res) => {
  let filter = {};
  if (req.query.filter){
    filter = JSON.parse(req.query.filter);
  }

  Project.updateOne(filter, function(err, result) {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(400).send(err.message);
      }
    }
  );
});

router.put("/:id", (req, res) => {
  Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    },
    function(err, result) {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(400).send(err.message);
      }
    }
  );
});

router.delete("/", (req, res) => {
  let filter = {};
  if (req.query.filter){
    filter = JSON.parse(req.query.filter);
  }
  Project.deleteOne(filter, function(err, result) {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(200).send(err.message);
    }
  });
});

router.put("/addmilestone/:id", (req, res) => {
  // https://meanmentor.com/single.php?id=12

  /*const project = await Project.findById(req.params.id);
  project.milestones.push(req.body);
  project.save(function(err, result) {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(200).send(err.message);
    }
  });*/

  /*Project.findById(req.params.id, function(err, result){
    if (!err) {
      result.push(req.body);
      result.save(function(saveerr, saveresult) {
        if (!saveerr) {
          res.status(200).send(saveresult);
        }  else {
          res.status(200).send(saveerr.message);
        }
      });
    } else {
      res.status(400).send(err.message);
    }  
  })*/
  
  /*let updateMilestones = [];
  updateMilestones.push(req.body);

  let jsonData = { milestones: updateMilestones };
  Project.findByIdAndUpdate(
    req.params.id,
    { $push: jsonData },
    { new: true },
    function(err, result) {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(400).send(err.message);
      }
    }
  );*/

  //find the project first, then add the milestone to it
  //https://mongoosejs.com/docs/subdocs.html
  Project.findById(req.params.id, function(err, result) {
    if (!err) {
      if (!result){
        res.sendStatus(404).send('Project was not found').end();
      }
      else{
        result.milestones.push(req.body);
        result.markModified('milestones'); 
        result.save(function(saveerr, saveresult) {
          if (!saveerr) {
            res.status(200).send(saveresult);
          } else {
            res.status(400).send(saveerr.message);
          }
        });
      }
    } else {
      res.status(400).send(err.message);
    }
  });
});

router.put("/updatemilestone/:id", (req, res) => {
  /*
  //id param is the id of the milestone this time
  // https://meanmentor.com/single.php?id=12
  let jsonData = {
    'milestones.$.name': req.body.name,
    'milestones.$.status': req.body.status,
  }
  //Note: update seems to work but the result that gets sent to the client seems to give back the old version
  Project.findOneAndUpdate(
    { 'milestones._id': req.params.id },
    { $set: jsonData },
    function(err, result) {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(400).send(err.message);
      }
    }
  );*/

  //https://stackoverflow.com/questions/15691224/mongoose-update-values-in-array-of-objects
  Project.findById(req.params.id, function(err, result) {
    if (!err) {
      if (!result){
        res.status(404).send('Project was not found');
      }
      else{
        /*result.milestones.id(req.body._id).update(req.body ,function(updateerr, updateresult) {
          if (updateerr) {
            res.status(400).send(updateerr.message);
          }
        });*/
        result.milestones.id(req.body._id).name = req.body.name;
        result.milestones.id(req.body._id).status = req.body.status;
        result.milestones.id(req.body._id).description = req.body.description;
        result.markModified('milestones'); 
        result.save(function(saveerr, saveresult) {
          if (!saveerr) {
            res.status(200).send(saveresult);
          } else {
            res.status(400).send(saveerr.message);
          }
        });
      }
    } else {
      res.status(400).send(err.message);
    }
  });
});

router.put("/removemilestone/:id", (req, res) => {
  //find the project first, then locate and remove the milestone
  Project.findById(req.params.id, function(err, result) {
    if (!err) {
      if (!result){
        res.status(404).send('Project was not found');
      }
      else{
        result.milestones.id(req.body._id).remove(function(removeerr, removresult) {
          if (removeerr) {
            res.status(400).send(removeerr.message);
          }
        });
        result.markModified('milestones'); 
        result.save(function(saveerr, saveresult) {
          if (!saveerr) {
            res.status(200).send(saveresult);
          } else {
            res.status(400).send(saveerr.message);
          }
        });
      }
    } else {
      res.status(400).send(err.message);
    }
  });
});

module.exports = router;