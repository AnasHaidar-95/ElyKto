const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const userRouter = require("./Routes/userRoute");
const messageRouter = require("./Routes/messageRoutes");
const Message = require("./Models/messageSchema"); // استيراد موديل الرسالة
const userInfoRouter = require("./Routes/userInfoRoute.js");
const multer = require("multer");
const path = require("path");
const router = require("./Routes/uploadAvatar.js");


dotenv.config();
const app = express();
const server = http.createServer(app);

// إعداد socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // يفضل تحديد نطاق لاحقًا
    methods: ["GET", "POST"],
  },
});

// تخزين io داخل express app للوصول إليه في الكنترولرات (لو تحتاج)
app.set("io", io);

const PORT = process.env.PORT || 3000;
const DB = process.env.DATABASE_URL;

// middlewares
app.use(express.json());
app.use(cors());







const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm|mp3|mkv/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Only images and videos are allowed!'));
    }
  }
});

// Make uploads directory accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// File upload endpoint
app.post("/upload", upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({ url: fileUrl });
});

app.use("/", userRouter);
app.use("/messages", messageRouter);
app.use("/userinfo", userInfoRouter);
app.use("/", router);





// اتصال قاعدة البيانات
mongoose
  .connect(DB)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// ** إدارة المستخدمين المتصلين **
const onlineUsers = new Map(); // Map<userId, socketId>

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // انضمام المستخدم مع الـ userId (يجب أن يرسله العميل بعد الاتصال)
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(userId); // غرفة خاصة بالمستخدم (اختياري)
    io.emit("update-online-users", Array.from(onlineUsers.keys()));
    console.log(`👤 User ${userId} joined with socket ${socket.id}`);
  });

  // استقبال رسالة وإرسالها + حفظها في DB
  socket.on(
    "send-message",
    async ({ senderId, receiverId, text, image, voice,video, groupId }) => {
      try {
        // إنشاء رسالة جديدة
        const newMessage = new Message({
          senderId,
          receiverId,
          text,
          image,
          voice,
          video,
          groupId,
          status: "sent",
        });
        await newMessage.save();

        // إرسال الرسالة للمستلم إذا متصل
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", {
            _id: newMessage._id,
            senderId,
            receiverId,
            text,
            image,
            voice,
            video,
            groupId,
            status: "sent",
            createdAt: newMessage.createdAt,
          });
          io.to(receiverSocketId).emit("new-message", {
            senderId,
            message: newMessage, // يمكنك إرسال الرسالة كاملة أو فقط جزء منها
          });
        }

        // إرسال تأكيد للمرسل (اختياري)
        socket.emit("message-sent", newMessage);
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("error-message", "Failed to send message");
      }
    }
  );

  // عند قطع الاتصال، إزالة المستخدم من القائمة
  socket.on("disconnect", () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`❌ User ${userId} disconnected`);
        io.emit("update-online-users", Array.from(onlineUsers.keys()));
        break;
      }
    }
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// تشغيل السيرفر
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
