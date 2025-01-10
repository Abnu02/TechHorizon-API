const { Blog, validate } = require("../models/blog");
const { User } = require("../models/user");
require("dotenv").config();
const multer = require("multer");
const express = require("express");
const path = require("path");
const router = express.Router();
const createMulterUpload = require("./../utils/multerUpload");

const upload = createMulterUpload({
  destination: path.resolve(__dirname, "../../blogimages"),
  maxFileSize: 10 * 1024 * 1024, // 10 MB
  allowedFileTypes: /jpeg|jpg|png|pdf/, // Allowed extensions
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).send({ message: `Multer error: ${err.message}` });
  } else if (err.message === "Only images and PDFs are allowed.") {
    return res.status(400).send({ message: err.message });
  } else if (err.name === "ValidationError") {
    return res
      .status(400)
      .send({ message: `Validation error: ${err.message}` });
  }

  res.status(500).send({ message: "Internal server error" });
});

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("An image file is required.");
  }
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send("Invalid blog data: " + error.details[0].message);

  try {
    const imageData = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    };

    const findAuthor = await User.findById(req.body.author._id);

    let blog = new Blog({
      title: req.body.title,
      category: req.body.category,
      detail: req.body.detail,
      tag: req.body.tag,
      date: Date.now(),
      author: {
        _id: req.body.author._id,
        name: `${findAuthor.firstName} ${findAuthor.lastName}`,
      },
      image: imageData,
    });
    blog = await blog.save();

    res.status(201).send(blog);
  } catch (err) {
    res.status(400).send("Something went wrong. Please try again.");
  }
});

router.get("/", async (req, res) => {
  const blogs = await Blog.find();
  res.send(blogs);
});

router.get("/post", async (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Blog</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        form {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
        }
        label {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
        }
        input, textarea, button, fieldset {
            width: 100%;
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #007BFF;
        }
        textarea {
            resize: vertical;
        }
        fieldset {
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 4px;
        }
        legend {
            font-size: 16px;
            font-weight: bold;
        }
        button {
            background-color: #007BFF;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <form action="http://localhost:5000/api/blogs" method="POST" enctype="multipart/form-data">
        <h1>Create a New Blog Post</h1>
        <!-- Title -->
        <label for="title">Title:</label>
        <input type="text" id="title" name="title" minlength="3" required>

        <!-- category -->
        <label for="category">Category:</label>
        <input type="text" id="category" name="category" minlength="3" required>

        <!-- Detail -->
        <label for="detail">Detail:</label>
        <textarea id="detail" name="detail" minlength="10" required></textarea>

        <!-- Tag -->
        <label for="tag">Tag:</label>
        <input type="text" id="tag" name="tag">

        <!-- Date -->
        <label for="date">Date:</label>
        <input type="date" id="date" name="date">

        <!-- Author -->
        <fieldset>
            <legend>Author:</legend>

            <label for="author_id">Author ID:</label>
            <input type="text" id="author_id" name="author[_id]" required>

            <label for="author_name">Author Name:</label>
            <input type="text" id="author_name" name="author[name]" required>
        </fieldset>

        <!-- Image -->
        <fieldset>
            <legend>Image:</legend>

            <label for="image">Upload Image:</label>
            <input type="file" id="image" name="image" accept="image/*" required>
        </fieldset>

        <!-- Submit Button -->
        <button type="submit">Submit</button>
    </form>
</body>
</html>
`);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findOne({ _id: id });
  res.send(blog);
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res
        .status(400)
        .send("Invalid blog data: " + error.details[0].message);
    }

    const updateData = {
      title: req.body.title,
      category: req.body.category,
      detail: req.body.detail,
      tag: req.body.tag,
    };
    if (req.file) {
      updateData.image = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!blog) {
      return res.status(404).send("Blog post not found.");
    }

    res.status(200).send(blog);
  } catch (err) {
    console.error("Error updating blog post:", err);
    res.status(500).send("Something went wrong. Please try again.");
  }
});

module.exports = router;
