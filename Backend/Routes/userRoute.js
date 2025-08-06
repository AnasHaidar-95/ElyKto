const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getProfile,
  updateProfile,
  setOnlineStatus,
  getChattedUsers,
  unblock,
  changePassword,
  unblockUser,
} = require("../Controllers/userController.js");
const router = express.Router();
const User = require("../Models/userSchema.js");
const authenticateToken = require("../Midlleware/auth.js");

// for regester
router.post("/register", registerUser);
// login
router.post("/login", loginUser);
// get all users
router.get("/users", getAllUsers);
// get profile
router.get("/profile", authenticateToken, getProfile);
// update profile
router.put("/profile", authenticateToken, updateProfile);
// online user
router.post("/online", setOnlineStatus);
// setting 
router.patch("/blocked-users", authenticateToken, unblock);
router.post("/changePassword", authenticateToken, changePassword);
// friends
router.get("/:userId/chatted-users", getChattedUsers);

// for add ot frinds
router.post("/users/:id/add-friend", async (req, res) => {
  try {
    const userId = req.params.id;
    const friendId = req.body.friendId;

    if (userId === friendId) {
      return res.status(400).json({ message: "لا يمكنك إضافة نفسك كصديق" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // تحقق نوع الـ ObjectId بنفسك
    if (!user.friends.some((fId) => fId.toString() === friendId)) {
      user.friends.push(friendId);
      await user.save();
      return res.status(200).json({ message: "تمت إضافة الصديق بنجاح" });
    } else {
      return res.status(200).json({ message: "الصديق موجود مسبقاً" });
    }
  } catch (error) {
    console.error("خطأ في إضافة الصديق:", error);
    res
      .status(500)
      .json({ message: "حدث خطأ في السيرفر", error: error.message });
  }
});

// for get all frinds
// router.get("/users/:id/friends", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).populate(
//       "friends",
//       "fullName email avatar"
//     );
//     res.status(200).json(user.friends);
//   } catch (error) {
//     res.status(500).json({ message: "حدث خطأ", error });
//   }
// });

module.exports = router;
