import multer from "multer";

// Configure in-memory storage for high jewelry media buffers
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB maximum per high-resolution master photograph
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only high-resolution image formats (JPEG, PNG, WEBP) are accepted"));
    }
  },
});

export default uploadMiddleware;
