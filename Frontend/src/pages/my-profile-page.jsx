"use client";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { ArrowLeft, Camera, Edit3, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function MyProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.email || "");
      setAbout(user.about || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("fullName", name);
      formData.append("about", about);
      if (profileImage) {
        formData.append("avatar", profileImage);
      }

      const res = await axios.put("http://localhost:3000/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser((prev) => ({
        ...prev,
        ...res.data.user,
        avatar: res.data.user.avatar || prev.avatar, // تأكيد تحديث الصورة
      }));

      // ✅ مسح الصورة المؤقتة
      setPreviewUrl("");
      setProfileImage(null);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  return (
    <motion.div
      className="h-screen bg-black/20 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate(-1)}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
          </div>
          <motion.button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-2xl transition-all shadow-2xl shadow-sky-500/25 backdrop-blur-sm border border-white/10"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative inline-block mb-6">
            <motion.div
              className="w-32 h-32 rounded-full overflow-hidden mx-auto shadow-2xl border-4 border-white/20"
              
            >
              <img
                src={previewUrl || user?.avatar || "/11488433.png"}
                alt="Profile"
                className="over w-full h-full object-cover"
              />
            </motion.div>

            {isEditing && (
              <motion.label
                className="absolute bottom-0 right-0 p-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-full shadow-2xl shadow-sky-500/25 backdrop-blur-sm border border-white/10 transition-all cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setProfileImage(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                />
              </motion.label>
            )}
          </div>

          {/* Name and Email */}
          <div className="space-y-3">
            {isEditing ? (
              <motion.input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-3xl font-bold text-center bg-transparent border-b-2 border-sky-500 focus:outline-none text-white w-full py-2"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <motion.h2
                className="text-3xl font-bold text-white overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {name}
              </motion.h2>
            )}
            <p className="text-gray-400">{email}</p>
          </div>

          {/* About Section */}
          <div className="mt-8">
            {isEditing ? (
              <motion.textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:outline-none text-white placeholder-gray-400 resize-none"
                rows={4}
                placeholder="Tell us about yourself..."
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <motion.p
                className="text-gray-400 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {about || "No bio yet"}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white">
              Account Settings
            </h3>
          </div>
          <div className="divide-y divide-white/10">
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Email Address
              </label>
              {isEditing ? (
                <motion.input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <p className="text-gray-400">{email}</p>
              )}
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Phone Number
              </label>
              <p className="text-gray-400">
                {user?.phoneNumber || "Not provided"}
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Status
              </label>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-gray-400">Online</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
