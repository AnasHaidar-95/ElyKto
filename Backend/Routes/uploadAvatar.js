const express = require("express");
const router = express.Router();
const authenticateToken = require("../Midlleware/auth.js");
const upload = require("../Midlleware/upload.js");
const User = require("../Models/userSchema.js");
// const cloudinary = require("../config/cloudinary");

// تحديث الملف الشخصي
router.put(
  "/update",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { fullName, about } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: "الرجاء تسجيل الدخول أولاً" });
      }

      if (!fullName || !about) {
        return res
          .status(400)
          .json({ error: "الاسم والمعلومات الشخصية مطلوبة" });
      }

      let avatarUrl = null;

      if (req.file && req.file.path) {
        // الصورة تم رفعها تلقائياً إلى Cloudinary بواسطة multer-storage-cloudinary
        avatarUrl = req.file.path;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          fullName,
          about,
          ...(avatarUrl && { avatar: avatarUrl }),
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "المستخدم غير موجود" });
      }

      res.json({ message: "تم تحديث الملف الشخصي بنجاح", user: updatedUser });
    } catch (err) {
      console.error("حدث خطأ أثناء تحديث الملف الشخصي:", err);
      res
        .status(500)
        .json({ error: "خطأ داخلي في السيرفر", details: err.message });
    }
  }
);

module.exports = router;
