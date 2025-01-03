const Joi = require("joi");
const mongoose = require("mongoose");

// Define a schema for file metadata
const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
  mimetype: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
});

const lessonSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  title: { type: String },
  description: { type: String },
  file: [fileSchema],
});

const Schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  prerequisites: { type: String },
  duration: { type: String },
  author: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String },
    },
  ],
  lesson: [lessonSchema],
  enrolledStudent: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String },
    },
  ],
});

const validateLesson = (lesson) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    file: Joi.object({}),
  });

  return schema.validate(lesson);
};

const validate = (course) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    prerequisites: Joi.string(),
    duration: Joi.string(),
    author: Joi.array().items(
      Joi.object({
        _id: Joi.string().required(),
        name: Joi.string().required(),
      })
    ),
    lesson: Joi.array().items(validateLesson),
    enrolledStudent: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
      })
    ),
  });
  return schema.validate(course);
};

const Course = mongoose.model("Course", Schema);

module.exports.Course = Course;
module.exports.validate = validate;
module.exports.validateLesson = validateLesson;
