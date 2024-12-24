const Joi = require("joi");
const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  title: { type: String },
  description: { type: String },
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
    lesson: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
      })
    ),
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
