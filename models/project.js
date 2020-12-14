const mongoose = require("mongoose");
const milestoneSchema = require("./milestone.js").schema;

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String },
  clientname: { type: String, required: true },
  contact: { 
    type: String, 
    required: true, 
    index: {
      unique: true, 
      collation: { locale: 'en', strength:2 }
    },
    match: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/ 
  },
  estimatedcost: { type: Number },
  status: { type: String, 
          required: true,
          default: "in progress",
          enum: ["in progress", "completed", "halted"]},
  clientcode: { type: String, required: true,
    index: {
      unique: true,
    }
  },
  milestones: [milestoneSchema]
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;