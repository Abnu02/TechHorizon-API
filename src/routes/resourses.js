const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../../lessonFiles"));
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
