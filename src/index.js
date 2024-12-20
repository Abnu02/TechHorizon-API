require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const googleAuth = require("./routes/googleAuth");
const users = require("./routes/users");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/playground")
  .then(() => console.log("Connected to mongoDB..."))
  .catch((err) => console.log("Could not connect to mongoDB...", err));

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Routes
app.use("/auth/google", googleAuth);
app.use("/api/users", users);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
