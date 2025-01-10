require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const googleAuth = require("./routes/googleAuth");
const users = require("./routes/users");
const courses = require("./routes/courses");
const blogs = require("./routes/blogs");
const events = require("./routes/events");
const resources = require("./routes/resources");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/playground")
  .then(() => console.log("Connected to mongoDB..."))
  .catch((err) => console.log("Could not connect to mongoDB...", err));

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// static folders
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../lessonFiles")));
app.use(express.static(path.join(__dirname, "../blogImages")));
app.use(express.static(path.join(__dirname, "../blogImages")));
app.use(express.static(path.join(__dirname, "../resourceFiles")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Routes
app.use("/auth/google", googleAuth);
app.use("/api/users", users);
app.use("/api/courses", courses);
app.use("/api/blogs", blogs);
app.use("/api/events", events);
app.use("/api/resources", resources);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
