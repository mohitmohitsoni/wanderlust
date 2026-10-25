const multer = require("multer");
const configured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_KEY && process.env.CLOUDINARY_SECRET;
let upload;
if (configured) {
  const cloudinary = require("cloudinary").v2;
  const { CloudinaryStorage } = require("multer-storage-cloudinary");
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
  upload = multer({
    storage: new CloudinaryStorage({ cloudinary, params: { folder: "wanderlust", allowed_formats: ["png", "jpg", "jpeg", "webp"] } }),
    limits: { fileSize: 5 * 1024 * 1024 },
  });
} else {
  // No Cloudinary keys: accept the form but ignore the file (a placeholder image is used).
  upload = multer({ storage: multer.memoryStorage() });
}
module.exports = { upload, configured: !!configured };
