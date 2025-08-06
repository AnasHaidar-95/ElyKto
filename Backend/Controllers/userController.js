const User = require("../Models/userSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Message = require("../Models/messageSchema.js");

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, about } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const userid = Math.floor(Math.random() * 1000000);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      about,
      userid,
    });

    await newUser.save();

    // ✅ إنشاء التوكن مباشرة بعد التسجيل
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = newUser._doc;

    res.status(201).json({
      message: "User added successfully",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Enter email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User is not found " });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password invalid" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      message: "Login successfully",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "fullName email avatar"); // جلب الاسم والبريد والصورة فقط
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// jeneen for profil

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User  not found" });
    res.json({ user });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, about } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User  not found" });

    if (fullName !== undefined) user.fullName = fullName;
    if (about !== undefined) user.about = about;

    await user.save();

    const userData = user.toObject();
    delete userData.password;

    res.json({ message: "Profile updated", user: userData });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//////////////////////////////////////////////////////

exports.setOnlineStatus = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isonline = true;
    await user.save();

    res.status(200).json({ message: "User is now online", user });
  } catch (error) {
    console.error("Error setting online status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

///////////////////////////////////////////////////////
exports.getChattedUsers = async (req, res) => {
  const { userId } = req.params;

  try {
    // جلب المستخدم الحالي للحصول على قائمة المحظورين
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // جلب جميع الرسائل التي شارك فيها المستخدم (مرسل أو مستقبل)
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    // استخراج الـ IDs للمستخدمين الذين تواصل معهم
    const userIds = new Set();

    messages.forEach((msg) => {
      if (msg.senderId.toString() !== userId) {
        userIds.add(msg.senderId.toString());
      }
      if (msg.receiverId.toString() !== userId) {
        userIds.add(msg.receiverId.toString());
      }
    });

    // تحويل Set إلى Array
    const uniqueUserIds = Array.from(userIds);

    // حذف المحظورين من القائمة
    const visibleUserIds = uniqueUserIds.filter(
      (id) => !currentUser.blockedUsers.includes(id)
    );

    // جلب معلومات المستخدمين غير المحظورين فقط
    const users = await User.find({ _id: { $in: visibleUserIds } }).select(
      "-password"
    );

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getChattedUsers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//////////////////////////////////////////////////////////////////////////////
//  USER INFO MOOOOOO2MIN  لاحدا يقرب عالمللفات

exports.getUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.muteUser = async (req, res) => {
  try {
    const { userId, muteUserId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.mutedUsers.includes(muteUserId)) {
      user.mutedUsers.push(muteUserId);
      await user.save();
    }

    res.status(200).json({ message: "User muted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mute user" });
  }
};

  exports.blockUser = async (req, res) => {
    try {
      const { userId, blockUserId } = req.body;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!user.blockedUsers.includes(blockUserId)) {
        user.blockedUsers.push(blockUserId);
        await user.save();
      }
      await user.populate("blockedUsers", "fullName email");
      res
        .status(200)
        .json({
          message: "User blocked successfully",
          blockedUsers: user.blockedUsers,
        });
    } catch (err) {
      res.status(500).json({ message: "Failed to block user" });
    }
  };
// controllers/userController.js

exports.deleteContact = async (req, res) => {
  try {
    const { userId, contactId } = req.body;

    // تحقق إن userId و contactId موجودين
    if (!userId || !contactId) {
      return res.status(400).json({ message: "Missing userId or contactId" });
    }

    // حذف الصديق من مصفوفة friends
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: contactId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error("❌ Delete contact error:", err);
    res.status(500).json({ message: "Failed to delete contact" });
  }
};

exports.getUserMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("media");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ media: user.media });
  } catch (err) {
    console.error("Error fetching media:", err);
    res.status(500).json({ message: "Failed to get media" });
  }
};



// setting raneem 

exports.unblock = async (req, res) => {
  try {
    const userIdToUnblock = req.body.userId;
    const currentUser = await User.findById(req.user.userId);
    currentUser.blockedUsers = currentUser.blockedUsers.filter(
      (id) => id.toString() !== userIdToUnblock
    );
    await currentUser.save();

    await currentUser.populate("blockedUsers", "fullName email");

    res.status(200).json({
      message: "User unblocked successfully",
      blockedUsers: currentUser.blockedUsers,
    });  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ error: "Failed to unblock user" });
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
