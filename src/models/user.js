const Joi = require("joi");
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String },
  department: { type: String },
  college: { type: String },
  year: { type: String },
  birthDate: { type: Date },
  role: {
    type: String,
    enum: ["admin", "student", "teacher"],
    default: "student",
  },
  permissio: {
    type: [String],
    enum: ["read", "write", "delete", "update"],
    default: "read",
  },
  authType: {
    type: String,
    enum: ["regular", "google"],
    required: true,
  },
  enrolledCorses: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      title: { type: String },
    },
  ],
});

const validate = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().when("authType", {
      is: "regular",
      then: Joi.string()
        .min(6)
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,30}$"))
        .required()
        .messages({
          "string.pattern.base":
            "Password must be 6-30 characters long and can include letters, numbers, and special characters (!@#$%^&*).",
        }),
      otherwise: Joi.forbidden(),
    }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .when("authType", {
        is: "regular",
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      })
      .messages({ "any.only": "Passwords must match." }),
    authType: Joi.string().valid("regular", "google").required(),
    role: Joi.string()
      .valid("admin", "student", "teacher")
      .default("student")
      .messages({
        "any.only": "Role must be one of 'admin', 'student', or 'teacher'.",
      }),
    permission: Joi.array()
      .items(Joi.string().valid("read", "write", "delete", "update"))
      .default(["read"])
      .messages({
        "array.includes":
          "Permissions must only include 'read', 'write', or 'delete'.",
        "array.base": "Permissions must be an array of strings.",
      }),
  });

  return schema.validate(user);
};

const validateDetail = (data) => {
  const schema = Joi.object({
    phone: Joi.string()
      .pattern(/^(\+251|0)[1-9]\d{8}$/)
      .messages({
        "string.pattern.base":
          "Phone number must start with '+251' or '0' and contain 9 digits after that.",
        "string.min": "Phone number must be at least 10 characters long.",
        "string.max": "Phone number must be at most 15 characters long.",
      }),
    department: Joi.string().optional(),
    college: Joi.string().optional(),
    year: Joi.alternatives()
      .try(Joi.string(), Joi.number())
      .optional()
      .messages({
        "alternatives.base": "Year must be either a string or a number.",
      }),
    birthDate: Joi.date().optional().messages({
      "date.base": "BirthDate must be a valid date.",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

const User = mongoose.model("User", Schema);

module.exports.User = User;
module.exports.validate = validate;
module.exports.validateDetail = validateDetail;
