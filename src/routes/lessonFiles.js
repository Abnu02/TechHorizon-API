require("dotenv").config();
const multer = require("multer");
const path = require("path");
const File = require("../models/lessonFile");
const express = require("express");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 256 * 1024 * 1024 }, // 256 MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|mp4|mkv|pdf/; // Allowed file extensions
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only images, videos, and PDFs are allowed"));
    }
  },
});

// Define a route for the home page
router.get("/", (req, res) => {
  res.send(`<form action="http://localhost:5000/api/lessonFiles/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="file">
  <button type="submit">Upload</button>
</form>
`);
});

router.get("/uploads/:file", (req, res) => {
  res.sendFile(path.join(__dirname, "uploads/", req.params.file));
});

// Error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(500).send({ message: err.message });
  } else if (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get("/file/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const file = await File.findById(req.params.id.slice(1));

    if (!file) {
      return res.status(404).send({ message: "File not found" });
    }
    res.sendFile(path.join(__dirname, "../../",file.path));
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error retrieving file" });
  }
});

// Define a route for file uploads
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    // Save file metadata in MongoDB
    const fileData = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    const savedFile = await fileData.save();

    res.status(200).send({
      message: "File uploaded and metadata stored successfully",
      file: savedFile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error saving file metadata" });
  }
});

// Define a route for multiple file uploads
router.post("/upload-multiple", upload.array("files", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "No files uploaded" });
    }

    // Save metadata for all uploaded files
    const fileDataArray = req.files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    }));

    const savedFiles = await File.insertMany(fileDataArray);

    res.status(200).send({
      message: "Files uploaded and metadata stored successfully",
      files: savedFiles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error saving file metadata" });
  }
});

module.exports = router;

/**
 * const express = require("express");
 const multer = require("multer");
 const cors = require("cors");
 const path = require("path");
 
 const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, "./uploads");
   },
   filename: (req, file, cb) => {
     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
     cb(
       null,
       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
     );
   },
 });
 
 // Initialize multer
 const upload = multer({
   storage: storage,
   limits: { fileSize: 256 * 1024 * 1024 }, // 256 MB limit
   fileFilter: (req, file, cb) => {
     const fileTypes = /jpeg|jpg|png|mp4|mkv|pdf/; // Allowed file extensions
     const extName = fileTypes.test(
       path.extname(file.originalname).toLowerCase()
     );
     const mimeType = fileTypes.test(file.mimetype);
 
     if (extName && mimeType) {
       return cb(null, true);
     } else {
       cb(new Error("Only images, videos, and PDFs are allowed"));
     }
   },
 });
 
 // Define a route for the home page
 app.get("/", (req, res) => {
   res.send(`<form action="http://localhost:3000/upload" method="POST" enctype="multipart/form-data">
   <input type="file" name="file">
   <button type="submit">Upload</button>
 </form>
 `);
 });
 
 app.get("/uploads/:file", (req, res) => {
   console.log(path.join(__dirname, "uploads/", req.params.file));
   res.sendFile(path.join(__dirname, "uploads/", req.params.file));
 });
 
 // Define a route for file uploads
 app.post("/upload", upload.single("file"), (req, res) => {
   if (!req.file) {
     return res.status(400).send({ message: "No file uploaded" });
   }
   console.log(req.file);
   res
     .status(200)
     .send({ message: "File uploaded successfully", file: req.file });
 });
 app.post("/upload-multiple", upload.array("files", 5), (req, res) => {
   if (!req.files || req.files.length === 0) {
     return res.status(400).send({ message: "No files uploaded" });
   }
   res
     .status(200)
     .send({ message: "Files uploaded successfully", files: req.files });
 });
 
 // Error handling middleware
 app.use((err, req, res, next) => {
   if (err instanceof multer.MulterError) {
     res.status(500).send({ message: err.message });
   } else if (err) {
     res.status(500).send({ message: err.message });
   }
 });
 
 // Start the server
 const PORT = 3000;
 app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
 });
 
 */
