const Message = require("../Models/messageSchema");
const User = require("../Models/userSchema");
// إرسال رسالة جديدة
exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, text, image, voice, groupId } = req.body;
  try {
    // Create the new message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image,
      voice,
      groupId,
      status: "sent",
    });

    const savedMessage = await newMessage.save();

    // Check if the sender and receiver are friends
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (sender && receiver) {
      // Add the receiver as a friend if not already in the sender's friends list
      if (!sender.friends.some((friend) => friend.toString() === receiverId)) {
        sender.friends.push(receiverId);
        await sender.save();
      }

      // Optionally, you can also add the sender as a friend to the receiver if not present
      if (!receiver.friends.some((friend) => friend.toString() === senderId)) {
        receiver.friends.push(senderId);
        await receiver.save();
      }
    }

    // Emit the message to the receiver through socket.io
    const io = req.app.get("io");
    if (receiverId) {
      io.to(receiverId.toString()).emit("receiveMessage", savedMessage);
    }

    // For group messages
    if (groupId) {
      io.to(groupId.toString()).emit("receiveMessage", savedMessage);
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Send message failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// جلب كل الرسائل بين مستخدمين (محادثة ثنائية)
exports.getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    if (!user1 || !user2) {
      return res.status(400).json({ message: "user1 and user2 are required" });
    }

    // البحث عن كل الرسائل بين user1 و user2 (مرسلة ومستقبلة)
    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Fetch messages failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// جلب الرسائل لمجموعة معينة (لو تستخدم مجموعات)
exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.query;

    if (!groupId) {
      return res.status(400).json({ message: "groupId is required" });
    }

    const messages = await Message.find({ groupId }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Fetch group messages failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};
