const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, 
          required: true,
          default: "pending approval",
          enum: ["pending approval", "approved"]},
  /*belongsToProject: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},*/
  
});

const Milestone = mongoose.model("Milestone", milestoneSchema);

module.exports = Milestone;