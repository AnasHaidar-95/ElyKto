"use client";

import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  Info,
  Smile,
  Send,
  Bell,
  Shield,
  MessageCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff as EndCall,
  VideoOff,
  Paperclip,
  RotateCcw,
  UserMinus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { socket } from "../socket.js";
import "../App.css";
import EmojiPicker from "emoji-picker-react";

function UserInfoModal({ user, currentUserId, onClose }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !currentUserId) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/userinfo/${user._id}`
        );
        setUserInfo(res.data.user);

        // Check if current user has muted this user
        const currentUser = JSON.parse(localStorage.getItem("user"));
        setIsMuted(currentUser?.mutedUsers?.includes(user._id) || false);

        const blockedUsersOfCurrentUser = currentUser.blockedUsers || [];
        setIsBlocked(blockedUsersOfCurrentUser.includes(user._id));
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUser();
  }, [user, currentUserId]);

  if (!userInfo) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center text-white">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Loading...
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-black/40 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-8 border border-white/10 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-3xl mx-auto mb-6 overflow-hidden">
            <img
              src={userInfo.avatar || "/11488433.png"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {userInfo.fullName || userInfo.name}
          </h2>
          <p className="text-gray-400 mb-2">{userInfo.email}</p>
          <p className="text-sm text-gray-500">
            {userInfo?.isonline === "true" ? "Online" : "Offline"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <ActionCard
            icon={Phone}
            label="Call"
            onClick={() => {
              onClose();
              navigate("/audio", { state: { user } });
            }}
          />
          <ActionCard
            icon={Video}
            label="Video"
            onClick={() => {
              onClose();
              navigate("/video", { state: { user } });
            }}
          />
          <ActionCard icon={MessageCircle} label="Message" onClick={onClose} />
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">About</h3>
          <p className="text-gray-300">
            {userInfo.about?.trim() || "No information provided."}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
          <div
            className="p-4 flex items-center space-x-3 hover:bg-white/5 transition-all cursor-pointer"
            onClick={async () => {
              try {
                const res = await axios.patch(
                  "http://localhost:3000/userinfo/mute",
                  {
                    userId: currentUserId,
                    muteUserId: userInfo._id,
                  }
                );

                // Update the local user data with the new muted users list
                if (res.data.mutedUsers) {
                  const updatedUser = {
                    ...currentUser,
                    mutedUsers: res.data.mutedUsers,
                  };
                  localStorage.setItem("user", JSON.stringify(updatedUser));
                }

                // Toggle the mute state based on the response
                const newIsMuted = !isMuted;
                setIsMuted(newIsMuted);

                alert(
                  `✅ User ${newIsMuted ? "muted" : "unmuted"} successfully`
                );
              } catch (error) {
                console.error("❌ Failed to toggle mute:", error);
                alert("❌ Failed to toggle mute");
              }
            }}
          >
            <Bell
              className={`w-5 h-5 ${
                isMuted ? "text-yellow-400" : "text-gray-400"
              }`}
            />
            <span className="text-white">
              {isMuted ? "Unmute notifications" : "Mute notifications"}
            </span>
          </div>

          <div
            className={`p-4 flex items-center space-x-3 border-t border-white/10 hover:bg-white/5 transition-all cursor-pointer ${
              isBlocked ? "bg-red-500/10" : ""
            }`}
            onClick={async () => {
              try {
                if (isBlocked) {
                  const res = await axios.patch(
                    "http://localhost:3000/blocked-users",
                    {
                      userId: userInfo._id,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  );
                  setIsBlocked(false);
                  if (res.data.blockedUsers) {
                    const updatedUser = {
                      ...currentUser,
                      blockedUsers: res.data.blockedUsers,
                    };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                  }
                  alert("✅ User unblocked successfully");
                } else {
                  const res = await axios.patch(
                    "http://localhost:3000/userinfo/block",
                    {
                      userId: currentUserId,
                      blockUserId: userInfo._id,
                    }
                  );
                  setIsBlocked(true);
                  if (res.data.blockedUsers) {
                    const updatedUser = {
                      ...currentUser,
                      blockedUsers: res.data.blockedUsers.map(
                        (u) => u._id || u
                      ),
                    };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                  }
                  alert("✅ User blocked successfully");
                  window.location.reload();
                }
              } catch (error) {
                console.error("❌ Failed to block/unblock user:", error);
                alert("❌ Failed to block/unblock user");
              }
            }}
          >
            <Shield
              className={`w-5 h-5 ${
                isBlocked ? "text-red-400" : "text-gray-400"
              }`}
            />
            <span className="text-white">
              {isBlocked ? "Unblock user" : "Block user"}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ActionCard({ icon: Icon, label, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      className="cursor-pointer bg-white/5 backdrop-blur-sm p-4 rounded-3xl text-center border border-white/10 hover:bg-white/10 transition-all"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-6 h-6 text-sky-400 mx-auto mb-2" />
      <span className="text-sm font-medium text-gray-300">{label}</span>
    </motion.div>
  );
}

function VideoCallModal({ user, onClose }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0">
        <img
          src={user.avatar || "/placeholder.svg?height=800&width=400"}
          alt="Remote User"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/50 to-transparent z-10">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={onClose}
            className="p-3 rounded-2xl bg-black/30 hover:bg-black/50 transition-all backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          <div className="text-center">
            <h2 className="text-white font-semibold text-xl">
              {user.fullName || user.name}
            </h2>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-4 py-2 mt-2 border border-white/20">
              <span className="text-white font-mono text-sm">
                {formatTime(callDuration)}
              </span>
            </div>
          </div>
          <div className="w-12" />
        </div>
      </div>

      <div className="absolute top-20 right-6 w-32 h-40 bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 z-10">
        {isVideoOn ? (
          <img
            src="/placeholder.svg?height=160&width=128"
            alt="You"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-black/60 flex items-center justify-center">
            <VideoOff className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent z-10">
        <div className="flex items-center justify-center space-x-6">
          <motion.button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-2xl transition-all backdrop-blur-sm border border-white/20 ${
              isMuted
                ? "bg-red-500/80 hover:bg-red-500 shadow-2xl shadow-red-500/25"
                : "bg-white/20 hover:bg-white/30"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </motion.button>

          <motion.button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-4 rounded-2xl transition-all backdrop-blur-sm border border-white/20 ${
              !isVideoOn
                ? "bg-red-500/80 hover:bg-red-500 shadow-2xl shadow-red-500/25"
                : "bg-white/20 hover:bg-white/30"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isVideoOn ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </motion.button>

          <motion.button
            className="p-4 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all border border-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </motion.button>

          <motion.button
            onClick={onClose}
            className="p-4 rounded-2xl bg-red-500/80 hover:bg-red-500 transition-all shadow-2xl shadow-red-500/25 backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <EndCall className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function AudioCallModal({ user, onClose }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-sky-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-blue-400 rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.25, 0.7, 0.25],
          }}
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      <motion.button
        onClick={onClose}
        className="absolute top-6 left-6 p-3 rounded-2xl bg-black/20 hover:bg-black/30 transition-all backdrop-blur-sm border border-white/20 z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </motion.button>

      <motion.div
        className="text-center mb-12 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="relative mb-8"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <img
            src={user.avatar || "/placeholder.svg?height=128&width=128"}
            alt="User"
            className="w-32 h-32 rounded-3xl object-cover mx-auto shadow-2xl shadow-black/50 border-4 border-white/20"
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {user.fullName || user.name}
        </h2>
        <p className="text-gray-300 text-xl mb-6">Audio Call</p>
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl px-8 py-4 inline-block border border-white/20">
          <span className="text-white font-mono text-2xl">
            {formatTime(callDuration)}
          </span>
        </div>
      </motion.div>

      <div className="flex items-center space-x-8 z-10">
        <motion.button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-5 rounded-2xl transition-all backdrop-blur-sm border border-white/20 ${
            isMuted
              ? "bg-red-500/80 hover:bg-red-500 shadow-2xl shadow-red-500/25"
              : "bg-white/20 hover:bg-white/30"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted ? (
            <MicOff className="w-7 h-7 text-white" />
          ) : (
            <Mic className="w-7 h-7 text-white" />
          )}
        </motion.button>

        <motion.button
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          className={`p-5 rounded-2xl transition-all backdrop-blur-sm border border-white/20 ${
            isSpeakerOn
              ? "bg-sky-500/80 hover:bg-sky-500 shadow-2xl shadow-sky-500/25"
              : "bg-white/20 hover:bg-white/30"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isSpeakerOn ? (
            <Volume2 className="w-7 h-7 text-white" />
          ) : (
            <VolumeX className="w-7 h-7 text-white" />
          )}
        </motion.button>

        <motion.button
          onClick={onClose}
          className="p-5 rounded-2xl bg-red-500/80 hover:bg-red-500 transition-all shadow-2xl shadow-red-500/25 backdrop-blur-sm border border-white/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <EndCall className="w-7 h-7 text-white" />
        </motion.button>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl px-8 py-4 border border-white/20">
          <p className="text-gray-300 text-sm">Call in progress...</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ChatPage({ user, currentUserId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showAudioCall, setShowAudioCall] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchMessages = async () => {
    if (!user || !currentUserId) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/messages?user1=${currentUserId}&user2=${user._id}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.url;
    } catch (err) {
      console.error("File upload failed:", err);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !fileInputRef.current?.files?.length) return;

    const newMessage = {
      senderId: currentUserId,
      receiverId: user._id,
      text: message,
    };

    if (fileInputRef.current?.files?.length) {
      const file = fileInputRef.current.files[0];
      const fileUrl = await handleFileUpload(file);

      if (file?.type.startsWith("image/")) {
        newMessage.image = fileUrl;
      } else if (file?.type.startsWith("video/")) {
        newMessage.video = fileUrl;
      }
    }

    socket.emit("send-message", newMessage);
    setMessage("");
    fileInputRef.current.value = "";
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    if (user && currentUserId) {
      socket.connect();
      socket.emit("join", currentUserId);

      socket.on("update-online-users", (onlineUserIds) => {
        setOnlineUsers(onlineUserIds);
      });

      fetchMessages();
      const interval = setInterval(fetchMessages, 2000);

      socket.on("receive-message", (newMsg) => {
        if (
          (newMsg.senderId === currentUserId &&
            newMsg.receiverId === user._id) ||
          (newMsg.senderId === user._id && newMsg.receiverId === currentUserId)
        ) {
          setMessages((prev) => [...prev, newMsg]);
        }
      });

      socket.on("message-sent", (savedMsg) => {
        setMessages((prev) => [...prev, savedMsg]);
      });

      return () => {
        socket.off("receive-message");
        socket.off("message-sent");
        socket.off("update-online-users");
        clearInterval(interval);
      };
    }
  }, [user, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-black relative">
      {/* Header */}
      <motion.div
        className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate("/")}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>
            <div className="relative">
              <img
                src={user.avatar || "/11488433.png"}
                alt={user.name}
                className="w-12 h-12 rounded-2xl object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">
                {user.fullName || user.name}
              </h2>
              <p className="text-sm text-gray-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setShowAudioCall(true)}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-5 h-5 text-gray-300" />
            </motion.button>
            <motion.button
              onClick={() => setShowVideoCall(true)}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Video className="w-5 h-5 text-gray-300" />
            </motion.button>
            <motion.button
              onClick={() => setShowUserInfo(true)}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Info className="w-5 h-5 text-gray-300" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg._id}
              className={`flex ${
                msg.senderId === currentUserId ? "justify-end" : "justify-start"
              }`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div
                className={`max-w-xs lg:max-w-md px-6 py-4 rounded-3xl backdrop-blur-sm border ${
                  msg.senderId === currentUserId
                    ? "bg-gradient-to-r from-sky-500/80 to-blue-600/80 text-white border-white/20 shadow-2xl shadow-sky-500/25"
                    : "bg-white/10 text-white border-white/10"
                }`}
              >
                {msg.text && (
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                )}
                {msg.image && (
                  <div className="mt-3">
                    <img
                      src={msg.image || "/placeholder.svg"}
                      alt="Chat image"
                      className="max-w-full max-h-60 rounded-2xl hover:w-90 hover:h-1/3"
                    />
                  </div>
                )}
                {msg.video && (
                  <div className="mt-3">
                    <video
                      src={msg.video}
                      controls
                      className="max-w-full max-h-60 rounded-2xl"
                    />
                  </div>
                )}
                <div className="flex items-center justify-end mt-3 space-x-1">
                  <span
                    className={`text-xs ${
                      msg.senderId === currentUserId
                        ? "text-white/70"
                        : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <motion.div
        className="bg-black/40 backdrop-blur-xl border-t border-white/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files.length) handleSendMessage(e);
            }}
          />
          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all"
            disabled={isUploading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Paperclip className="w-5 h-5 text-gray-300" />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setShowEmojiPicker((v) => !v)}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isUploading}
          >
            <Smile className="w-5 h-5 text-gray-300" />
          </motion.button>

          <div className="flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
          {/* لوحة اختيار الإيموجي */}
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-0 z-50">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                theme="dark"
                height={300}
                width={300}
              />
            </div>
          )}

          <motion.button
            type="submit"
            className="p-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-2xl transition-all shadow-2xl shadow-sky-500/25 backdrop-blur-sm border border-white/10"
            disabled={isUploading}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showUserInfo && (
          <UserInfoModal
            user={user}
            currentUserId={currentUserId}
            onClose={() => setShowUserInfo(false)}
          />
        )}
        {showVideoCall && (
          <VideoCallModal user={user} onClose={() => setShowVideoCall(false)} />
        )}
        {showAudioCall && (
          <AudioCallModal user={user} onClose={() => setShowAudioCall(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
