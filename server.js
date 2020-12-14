const express = require('express');
const database = require("./database.js");
const milestoneRoutes = require("./routes/milestone.js");
const projectRoutes = require("./routes/project.js");

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use("/api/milestone", milestoneRoutes);
app.use("/api/project", projectRoutes);


app.listen(process.env.PORT || 3000, () => console.log('server started'));