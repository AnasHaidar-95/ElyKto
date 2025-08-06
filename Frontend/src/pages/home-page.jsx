import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Settings, User, MessageCircle } from "lucide-react";
import ChatPage from "./chat-page.jsx";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import "../App.css";

// Updated Modal component with animations
function Modal({ children, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-black/40 backdrop-blur-xl rounded-3xl max-w-md w-full p-6 border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function HomePage() {
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const socket = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id;

  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
      return;
    }

    async function fetchFriends() {
      try {
        const response = await axios.get(
          `http://localhost:3000/${currentUserId}/chatted-users`
        );
        setFriends(response.data);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    }

    if (currentUserId) {
      fetchFriends();
    }

    if (!currentUserId) return;

    socket.current = io("http://localhost:3000");
    socket.current.emit("join", currentUserId);

    socket.current.on("update-online-users", (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [currentUserId]);

  const handleNewChat = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      const filteredUsers = response.data.filter(
        (user) =>
          user._id !== currentUserId &&
          !friends.some((friend) => friend._id === user._id)
      );
      setAllUsers(filteredUsers);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const startChatWithUser = (user) => {
    setSelectedUser(user);
  };

  const sendMessage = async (messageContent) => {
    if (!selectedUser) return;

    try {
      await axios.post(`http://localhost:3000/messages/send`, {
        senderId: currentUserId,
        receiverId: selectedUser._id,
        text: messageContent,
      });

      const alreadyInFriends = friends.some(
        (friend) => friend._id === selectedUser._id
      );

      if (!alreadyInFriends) {
        const updated = await axios.get(
          `http://localhost:3000/${currentUserId}/chatted-users`
        );
        setFriends(updated.data);
      }
    } catch (error) {
      console.error("Failed to send message or add friend:", error);
    }
  };

  const filteredFriends = friends.filter((user) =>
    user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsersForModal = allUsers.filter((user) =>
    user?.fullName?.toLowerCase().includes(modalSearchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-black overflow-hidden">
      {/* Animated Sidebar */}
      <motion.div
        className="w-full md:w-80 lg:w-96 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold overflow-visible text-white">
              Chats
            </h1>
            <div className="flex items-center overflow-hidden space-x-2">
              <motion.button
                onClick={() => navigate("/profile")}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all"
                // whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-5 h-5 overflow-visible text-gray-300" />
              </motion.button>
              <motion.button
                onClick={() => navigate("/setting")}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all"
                // whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5 overflow-visible text-gray-300" />
              </motion.button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Friends List with Animations */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredFriends.length > 0 ? (
              filteredFriends.map((user, index) => (
                <motion.div
                  key={user._id}
                  onClick={() => startChatWithUser(user)}
                  className="p-4 hover:bg-white/5 cursor-pointer transition-all border-b border-white/5 flex items-center space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  // whileHover={{ x: 4 }}
                >
                  <div className="relative">
                    <img
                      src={user.avatar || "/11488433.png"}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                    {onlineUsers.includes(user._id) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {user.fullName}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="p-8 text-center text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No friends found.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Animated New Chat Button */}
        <div className="p-6 border-t border-white/10">
          <motion.button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-2xl shadow-sky-500/25 backdrop-blur-sm border border-white/10 flex items-center justify-center space-x-3"
            // whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5 overflow-hidden" />
            <span>New Chat</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Chat Display with Animations */}
      <motion.div
        className="hidden md:flex flex-1 items-center justify-center bg-black/20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {selectedUser ? (
          <ChatPage
            user={selectedUser}
            currentUserId={currentUserId}
            sendMessage={sendMessage}
          />
        ) : (
          <div className="text-center max-w-md pt-10 mx-auto px-6">
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-sky-500/25"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <MessageCircle className="w-16 h-16 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold overflow-hidden text-white mb-6">
              Welcome to ElyKto
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed text-lg">
              Select a chat from the sidebar to start messaging, or create a new
              conversation to connect with friends.
            </p>
          </div>
        )}
      </motion.div>

      {/* Modal for New Chat Users */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-6 text-white">Start New Chat</h2>
          <input
            type="text"
            placeholder="Search users..."
            value={modalSearchQuery}
            onChange={(e) => setModalSearchQuery(e.target.value)}
            className="w-full mb-6 px-4 py-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredUsersForModal.length > 0 ? (
              filteredUsersForModal.map((user) => (
                <motion.div
                  key={user._id}
                  onClick={() => {
                    startChatWithUser(user);
                    setIsModalOpen(false);
                    setModalSearchQuery("");
                  }}
                  className="p-4 hover:bg-white/5 cursor-pointer flex items-center space-x-3 rounded-2xl transition-all"
                  // whileHover={{ x: 4 }}
                >
                  <img
                    src={user.avatar || "/11488433.png"}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-2xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {user.fullName}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">No users found.</p>
            )}
          </div>
          <motion.button
            onClick={() => {
              setIsModalOpen(false);
              setModalSearchQuery("");
            }}
            className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all backdrop-blur-sm border border-white/10"
            // whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Close
          </motion.button>
        </Modal>
      )}
    </div>
  );
}
