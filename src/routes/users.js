const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = new User(req.body);
    user = await user.save();

    res.status(201).send({
      _id: user._id,
      name: user.firstName + user.lastName,
      email: user.email,
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).send("user already registerd please log in instead.");
  }
});

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get("/profile", (req, res) => {
  if (req.session.user) {
    res.send(
      `Hello ${req.session.user.firstName} ${req.session.user.lastName}`
    );
  } else {
    res.send("sign in first");
  }
});

module.exports = router;

// Create a new user
// async function createUser() {
//   const user = new User({
//     firstName: "Esu",
//     lastName: "E",
//     email: "esu.e@gmail.com",
//     password: "asdfrewq",
//     confirmPassword: "asdfrewq",
//   });

//   try {
//     const result = await user.save();
//     console.log("User created successfully:", result);
//   } catch (err) {
//     console.error("Error:", err.message);
//   }
// }

// async function getUsers() {
//   try {
//     const users = await User.find();
//     console.log("Users:", users);
//   } catch (err) {
//     console.error("Error fetching users:", err.message);
//   }
// }
