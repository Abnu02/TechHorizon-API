require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const passport = require("passport");
const { googleAuth } = require("./routes/googleAuth");

const app = express();

// Express session configuration
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../public")));

// Home page route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Routes
app.use("/auth/google", googleAuth);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
