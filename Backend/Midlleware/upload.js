const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: file.mimetype.startsWith("video/")
        ? "chat-app/videos"
        : "chat-app/avatars",
      resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "mp4",
        "mov",
        "avi",
        "webm",
        "mkv",
        "gif",
      ],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
