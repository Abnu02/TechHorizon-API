const express = require("express");
const passport = require("passport");
const router = express.Router();
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/protected",
    failureRedirect: "/auth/google/failure",
  })
);

router.get("/protected", isLoggedIn, (req, res) => {
  res.send(
    `Hello ${req.user.displayName} </br> <a href='/auth/google/logout'>logout</a>`
  );
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Session Destroy Error:", err);
        return next(err);
      }

      res.send("Goodbye!");
    });
  });
});

router.get("/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

module.exports = router;