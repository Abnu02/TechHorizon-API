const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
  let { value, error } = validate(req.body);
  if (error) return res.status(200).send("error");

  res.send("accoutn created", value);
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
