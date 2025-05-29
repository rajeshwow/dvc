const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const createDirectories = () => {
  const dirs = ["uploads", "uploads/products"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Create directories on server startup
createDirectories();

// Configure product image storage
const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/products";
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "product-" + uniqueSuffix + ext);
  },
});

// File filter to only allow image files
const imageFilter = (req, file, cb) => {
  // Accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Create multer upload instances
const uploadProductImage = multer({
  storage: productImageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("images");

// Use the correct field name that matches your frontend
const uploadMultipleProductImages = multer({
  storage: productImageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).array("images", 5); // Match this field name with what you're using in the frontend

// Middleware wrapper for better error handling
const handleUpload = (uploadFn) => {
  return (req, res, next) => {
    uploadFn(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "File size limit exceeded (max: 5MB)" });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        // An unknown error occurred
        return res.status(500).json({ error: err.message });
      }

      // Log received data for debugging
      console.log("Request after multer processing:");
      console.log("- Body:", req.body);
      console.log("- Files:", req.files || req.file);

      // Everything went fine
      next();
    });
  };
};

// Export middleware with error handling
module.exports = {
  uploadProductImage: handleUpload(uploadProductImage),
  uploadMultipleProductImages: handleUpload(uploadMultipleProductImages),
};
