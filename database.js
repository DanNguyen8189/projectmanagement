const mongoose = require("mongoose");

mongoose.connect(
   "mongodb+srv://" + process.env.DBUser + ":" + process.env.DBPass +  "@cs157.5d1qt.mongodb.net/ProjectManagementApp?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to MongoDB...");
    }
  }
);