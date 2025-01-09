const multer = require("multer");
const path = require("path");

/**
 * Generates a multer upload instance with custom configuration
 * @param {string} destination - The folder where files will be stored
 * @param {Array<string>} allowedFileTypes - Array of allowed file extensions (e.g., ['jpeg', 'jpg', 'png', 'mp4', 'mkv', 'pdf'])
 * @param {number} fileSizeLimit - Maximum file size in bytes
 * @returns {multer.Multer} - Configured multer instance
 */
const createMulterUpload = (destination, allowedFileTypes, fileSizeLimit) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, destination));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  });

  const fileFilter = (req, file, cb) => {
    const fileTypes = new RegExp(allowedFileTypes.join("|")); // Convert array to regex
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${allowedFileTypes.join(", ")} files are allowed`));
    }
  };

  return multer({
    storage,
    limits: { fileSize: fileSizeLimit },
    fileFilter,
  });
};

module.exports = createMulterUpload;
