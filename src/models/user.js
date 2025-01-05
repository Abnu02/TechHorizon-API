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
  year: {
    type: Number,
    min: 1,
    max: 7,
    validate: {
      validator: Number.isInteger,
      message: "Year must be an integer between 1 and 7.",
    },
  },
  birthDate: { type: Date },
  role: {
    type: String,
    enum: ["admin", "student", "teacher"],
    default: "student",
  },
  permissio: {
    type: String,
    enum: ["read", "write", "delete"],
    default: "read",
  },
  authType: {
    type: String,
    enum: ["regular", "google"],
    required: true,
  },
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
  });

  return schema.validate(user);
};

const validateDetail = (data) => {
  const schema = Joi.object({
    phone: Joi.string().pattern(/^\d+$/).min(10).max(15).optional().messages({
      "string.pattern.base": "Phone number must contain only digits.",
      "string.min": "Phone number must be at least 10 digits.",
      "string.max": "Phone number must be at most 15 digits.",
    }),
    department: Joi.string().optional(),
    college: Joi.string().optional(),
    year: Joi.number().integer().min(1).max(7).optional().messages({
      "number.base": "Year must be a number.",
      "number.integer": "Year must be an integer.",
      "number.min": "Year must be at least 1.",
      "number.max": "Year must be at most 7.",
    }),
    birthDate: Joi.date().optional().messages({
      "date.base": "BirthDate must be a valid date.",
    }),
    role: Joi.string()
      .valid("admin", "student", "teacher")
      .default("student")
      .messages({
        "any.only": "Role must be one of 'admin', 'student', or 'teacher'.",
      }),
    permission: Joi.string()
      .valid("read", "write", "delete")
      .default("read")
      .messages({
        "any.only": "Permission must be one of 'read', 'write', or 'delete'.",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

const User = mongoose.model("User", Schema);

module.exports.User = User;
module.exports.validate = validate;
module.exports.validateDetail = validateDetail;
