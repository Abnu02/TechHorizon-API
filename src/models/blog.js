const Joi = require("joi");
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
  mimetype: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
});

const Schema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  detail: { type: String, required: true },
  tag: { type: String },
  date: { type: Date, default: Date.now },
  author: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
  },
  image: ImageSchema,
});

const validate = (blog) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    category: Joi.string().min(3).required(),
    detail: Joi.string().min(10).required(),
    tag: Joi.string(),
    date: Joi.date(),
    author: Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required(),
    }),
  });

  return schema.validate(blog);
};

const Blog = mongoose.model("Blog", Schema);

module.exports.Blog = Blog;
module.exports.validate = validate;

// const imageSchema = new mongoose.Schema({
//   filename: { type: String },
//   originalname: { type: String },
//   path: { type: String },
//   mimetype: { type: String },
//   size: { type: Number },
// });
