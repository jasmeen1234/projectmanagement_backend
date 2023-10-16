const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoute = require('./routes/user');
const app = express();
const cors=require("cors");
app.use(cors());
const Project = require("./projectSchema.js");


const PORT = process.env.PORT || 8080;


 app.use(express.json());


// mongoose.connect("mongodb://localhost:27017/esther").then(()=>{
//     console.log('connected');
// }).catch((err)=>{
//      console.log(err);
// })
 app.use('/api/user',userRoute);





// Assuming projectSchema.js exports a mongoose model


app.use(bodyParser.json());

// Connect to MongoDB using mongoose
const uri =
"mongodb+srv://jasmeenbano12:jasmeenbano12@cluster0.p332uil.mongodb.net/?retryWrites=true&w=majority";
  // Note: You should have the database name at the end of your URI.

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// sign up
app.post("http://localhost:8080/api/user/login", async (req, res) => {
  console.log(req.body);
  try {
    await User.create({
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Duplicate email" });
  }
});
app.post("/project", async (req, res) => {
  try {
    let project = await Project.create(req.body);
    console.log(project);
    res.status(201).send(project);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.get("/project", async (req, res) => {
  try {
    let projects = await Project.find({});
    res.status(200).send(projects);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/projects/deptwise", async (req, res) => {
  let chartData = await Project.aggregate([
    {
      $match: {
        status: { $in: ["registered", "Completed"] },
      },
    },
    {
      $group: {
        _id: { dept: "$dept", status: "$status" },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.dept",
        statuses: {
          $push: {
            status: "$_id.status",
            count: "$count",
          },
        },
      },
    },
  ]);

  res.status(200).send(chartData);
});

app.patch("/api/project/:id", async (req, res) => {
  try {
    // Get the id from the request parameters
    const projectId = req.params.id;
    // Update the project with the provided data in req.body
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedProject) {
      // Project not found
      return res.status(404).send("Project not found");
    }
    console.log(updatedProject);
    res.status(200).send("Update Successful!");
  } catch (error) {
    console.error("Error updating project status:", error);
    res.status(500).send("Internal Server Error");
  }
});

// dashboard project count
app.get('/dashboard', async (req, res) => {
  try {
    const total = await Project.find({});
    const closed = await Project.find({ status: 'close' });
    const running = await Project.find({ status: 'running' });
    const closureDelay = await Project.find({ status: 'Closure Delay' });
    const canceled = await Project.find({ status: 'register' });

    const projectCounts = {
      total:total.length,
      close:closed.length,
      running:running.length,
      closureDelay:closureDelay.length,
      canceled:canceled.length,
    };
    console.log(projectCounts);
    res.json(projectCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching project counts' });
  }
});

// create project
app.post("/createproject", async (req, res) => {
  try {
    let project=req.body;
    console.log(project);
   let newProject = new Project(project);
  await newProject.save();
  res.status(201).json({msg: "creation successfully"});

  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
