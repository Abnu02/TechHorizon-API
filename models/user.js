const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Prevent duplicate emails
  password: { type: String, required: true, minlength: 6 },
  confirmPassword: { type: String, required: true, minlength: 6 },
});

// Password confirmation validation
userSchema.pre("validate", function (next) {
  if (this.password !== this.confirmPassword) {
    this.invalidate("confirmPassword", "Passwords must match");
  }
  next();
});

const User = mongoose.model("User", userSchema);

const validate = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirmPassword: Joi.ref("password"),
  });

  return schema.validate(user);
};

module.exports.User = User;
module.exports.validate = validate;
