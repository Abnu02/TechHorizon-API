const { Course, validate, validateLesson } = require("../models/course");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  try {
    let course = new Course(req.body);
    course = await course.save();

    res.status(201).send(course);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("something went wrong try again please.");
  }
});

router.get("/", async (req, res) => {
  const course = await Course.find();
  res.send(course);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id.slice(1);
  const course = await Course.findOne({ _id: id });
  res.send(course);
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

router.put("/:id/lesson", async (req, res) => {
  const { error } = validateLesson(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const id = req.params.id.slice(1);
  const { title, description } = req.body;

  try {
    const course = await Course.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          lesson: {
            title: title, 
            description: description,
          },
        },
      },
      { new: true }
    );
    if (!course) return res.status(404).send("Course not found.");

    res.send(course);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Something went wrong, please try again.");
  }
});

module.exports = router;
