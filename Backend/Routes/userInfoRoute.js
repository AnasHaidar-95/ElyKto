const express = require("express");
const router2 = express.Router();
const {
  getUserInfo,
  muteUser,
  blockUser,
  deleteContact,
  getUserMedia,
} = require("../Controllers/userController.js");

// GET media
router2.get("/:id/media", getUserMedia);
// GET معلومات مستخدم
router2.get("/:id", getUserInfo);

// POST mute
router2.patch("/mute", muteUser);

// POST block
router2.patch("/block", blockUser);

// DELETE contact
router2.delete("/contact", deleteContact);

module.exports = router2;
