const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let projectSchema = new Schema({
  
  name: String,
  startDate: Date,
  endDate: Date,
  status: {type:String,default: "register"},
  reason: String,
  type: String,
  division: String,
  category:{type:String,default:"Quality A"},
  priority: {type:String,default:"low"},
  dept: {type:String,default:"finance"},
  location: String,
  userId: {type:String,default: "NA"},
  projectDescription: {type:String,default: "NA"}

});

module.exports = mongoose.model("project", projectSchema);
