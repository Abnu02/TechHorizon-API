const mongoose = require("mongoose");
const Joi = require("joi");

// Define a schema for file metadata
const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
  mimetype: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
});

const Schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  type: {
    type: String,
    enum: ["File", "Link", "Video"],
    required: true,
  },
  file: { type: fileSchema },
  url: {
    type: String,
    required: function () {
      return this.type === "Link";
    },
  },
  author: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
  },
  uploadDate: { type: Date, default: Date.now },
});

// Validation schema
const validate = (resource) => {
  const fileSchema = Joi.object({
    filename: Joi.string().required(),
    originalname: Joi.string().required(),
    path: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().positive().required(),
    uploadDate: Joi.date(),
  });

  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string(),
    category: Joi.string(),
    type: Joi.string().valid("File", "Link", "Video").required(),
    file: Joi.alternatives().conditional("type", {
      is: "File",
      then: fileSchema.required(),
      otherwise: Joi.forbidden(), // Not allowed unless type is 'File'
    }),
    url: Joi.alternatives().conditional("type", {
      is: "Link",
      then: Joi.string().uri().required(),
      otherwise: Joi.forbidden(), // Not allowed unless type is 'Link'
    }),
    author: Joi.object({
      _id: Joi.string().required(),
      name: Joi.string(),
    }),
    uploadDate: Joi.date(),
  });

  return schema.validate(resource);
};

const Resource = mongoose.model("Resource", Schema);

module.exports.Resource = Resource;
module.exports.validate = validate;
