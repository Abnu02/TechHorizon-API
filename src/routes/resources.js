const express = require("express");
const path = require("path");
const router = express.Router();
const { User } = require("./../models/user");
const { Resource, validate } = require("../models/resource");
const createMulterUpload = require("../utils/multerUpload");

const upload = createMulterUpload({
  destination: path.resolve(__dirname, "../../resourceFiles"),
  maxFileSize: 120 * 1024 * 1024, // 120 MB space
  allowedFileTypes: ["mp4", "ts", "ppt", "pptx", "pdf", "docx"],
});

router.post("/", upload.single("file"), async (req, res) => {
  console.log(JSON.parse(req.body.author));
  const author = JSON.parse(req.body.author);
  try {
    if ((req.body.type === "File" || req.body.type === "Video") && !req.file) {
      return res.status(400).send({
        success: false,
        message: "File upload is required for this type.",
      });
    }
    const resourceData = {
      ...req.body,
      author: author,
      file: req.file
        ? {
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
          }
        : null,
    };

    const { error } = validate(resourceData);
    if (error) {
      return res.status(400).send({
        success: false,
        message: "Invalid data",
        details: error.details[0].message,
      });
    }

    const findAuthor = await User.findById(author._id);
    if (!findAuthor) {
      return res
        .status(404)
        .send({ success: false, message: "Author not found." });
    }

    const resource = new Resource({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      type: req.body.type,
      file: resourceData.file,
      url: req.body.url,
      author: {
        _id: author._id,
        name: `${findAuthor.firstName} ${findAuthor.lastName}`,
      },
    });

    const savedResource = await resource.save();
    res.status(201).send({ success: true, data: savedResource });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, message: "Server error. Please try again." });
  }
});

router.get("/", async (req, res) => {
  const resources = await Resource.find();

  res.send(resources);
});

router.get("/:id", async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if(!resource) return res.status()

  res.status(200).send(resource);
});

module.exports = router;
