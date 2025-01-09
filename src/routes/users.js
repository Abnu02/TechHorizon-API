const { Course } = require("../models/course");
const { User, validate, validateDetail } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = new User(req.body);
    user = await user.save();

    res.status(201).send(user);
  } catch (err) {
    res.status(400).send("user already registerd please log in instead.");
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (!user) return res.status(400).send("Invalid email or password.");

  req.session.user = user;
  res.send(user);
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    res.send("Goodbye!");
  });
});

router.put("/:id", async (req, res) => {
  let { error } = validateDetail(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      phone: req.body.phone,
      college: req.body.college,
      department: req.body.department,
      year: req.body.year,
      birthDate: req.body.birthDate,
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user);
});

router.put("/:id/enroll", async (req, res) => {
  const { id: userId } = req.params;
  const { id: courseId, name } = req.body;

  if (!courseId || !name) {
    return res.status(400).send("Course ID and user name are required.");
  }

  try {
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .send("The course with the given ID was not found.");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("The user with the given ID was not found.");
    }

    // Prevent duplicate enrollment
    const alreadyEnrolled = course.enrolledStudent.some(
      (student) => student._id.toString() === userId
    );
    if (alreadyEnrolled) {
      return res.status(400).send("You have already enrolled in this course.");
    }

    // Update course and user concurrently
    const [updatedCourse, updatedUser] = await Promise.all([
      Course.findByIdAndUpdate(
        courseId,
        {
          $push: {
            enrolledStudent: { _id: userId, name },
          },
        },
        { new: true }
      ),
      User.findByIdAndUpdate(
        userId,
        {
          $push: {
            enrolledCorses: { _id: courseId, title: course.title },
          },
        },
        { new: true }
      ),
    ]);

    res.send({ updatedCourse, updatedUser });
  } catch (error) {
    console.error("Error enrolling user:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user);
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
