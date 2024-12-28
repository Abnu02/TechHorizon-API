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

const File = mongoose.model("File", fileSchema);

module.exports = File;
