const express = require("express");
const passport = require("../config/passportConfig");
const googleAuth = express.Router();

// Route to start the Google authentication process
googleAuth.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleAuth.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/" }), 
  (req, res) => {
    res.redirect("/profile");
  }
);

googleAuth.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/"); 
  res.send(`Welcome ${req.user.displayName}`);
});

googleAuth.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.redirect("/"); 
    res.redirect("/"); 
  });
});

module.exports = { googleAuth };
