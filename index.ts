const express = require("express");
const bodyParser = require("body-parser");
const app = express();

var task, complete;

function updateValues(callback: any) {
  sqlite.getTodoList(function (result: any) {
    task = result;
    sqlite.getDoneList(function (result: any) {
      complete = result;
      callback();
    });
  });
}

// Handles whenever the root directory of the website is accessed.
app.get("/", function (req, res) {
  updateValues(function () {
    res.render("index", { task: task, complete: complete });
  });
});

app.post("/addtask", function (req, res) {
  var newTask = req.body.newtask;
  // Add the new task from the post route.
  sqlite.addTask(newTask, function () {
    res.redirect("/");
  });
});

// Removing a task.
app.post("/removetask", function (req: any, res: any) {
  var completeTask = req.body.check;
  sqlite.completeTask(completeTask, function () {
    res.redirect("/");
  });
});

// Clearing all complete tasks.
app.post("/clearcomplete", function (req: any, res: any) {
  sqlite.clearComplete(function () {
    res.redirect("/");
  });
});

// Set app to listen on port 3000
app.listen(3000, function () {
  // @ts-ignore
  updateValues(function () {
    console.log("server is running on port 3000");
  });
});

// Set up BodyParser.
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to use Express.
app.set("view engine", "ejs");

// Custom-made SQLite module.
var sqlite = require("./modules/sqlite3");

// Render the CSS Files
app.use(express.static("public"));
