const Joi = require("joi");
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
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

const User = mongoose.model("User", Schema);

module.exports.User = User;
module.exports.validate = validate;
