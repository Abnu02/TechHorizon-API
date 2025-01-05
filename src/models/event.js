const Joi = require("joi");
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date },
  location: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  author: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
  },
});

const validate = (event) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    date: Joi.date(),
    location: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    category: Joi.string().min(3).required(),
    author: Joi.object({
      _id: Joi.string().required(),
    }).required(),
  });

  return schema.validate(event);
};

const Event = mongoose.model("Event", Schema);

module.exports.Event = Event;
module.exports.validate = validate;
