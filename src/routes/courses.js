const { Course, validate, validateLesson } = require("../models/course");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../../lessonFiles"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 256 * 1024 * 1024 }, // 256 MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|mp4|mkv|pdf/; // Allowed file extensions
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only images, videos, and PDFs are allowed"));
    }
  },
});

// Error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(500).send({ message: err.message });
  } else if (err) {
    res.status(500).send({ message: err.message });
  }
});

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
  const id = req.params.id;
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

router.put("/:id/lesson", upload.single("file"), async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).send("A file is required.");
    }

    // Validate lesson data
    const { error } = validateLesson(req.body);
    if (error)
      return res
        .status(400)
        .send("Invalid lesson data: " + error.details[0].message);

    // Process file metadata
    const fileData = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    };

    // Update the course with the new lesson
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          lesson: {
            title: req.body.title,
            description: req.body.description,
            file: fileData,
          },
        },
      },
      { new: true }
    );

    if (!course) return res.status(404).send("Course not found.");

    res.status(200).send(course);
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).send("Something went wrong. Please try again.");
  }
});

module.exports = router;
