"use client"

import { ArrowLeft, Moon, Sun, Lock, Palette, Globe, HelpCircle, LogOut, X } from "lucide-react"
import { useTheme } from "./theme-provider.jsx"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "./UserContext.jsx"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

const API_URL = "http://localhost:3000";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useContext(UserContext)
  const [expandedSection, setExpandedSection] = useState(null)
  const [blockedUsers, setBlockedUsers] = useState([])
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()

  const fetchBlocked = async () => {
    try {
      if (user?.blockedUsers) {
        setBlockedUsers(user.blockedUsers)
      }
    } catch (error) {
      console.error("Error fetching blocked users: ", error)
    }
  }

  useEffect(() => {
    fetchBlocked()
  }, [user])

  const toggleBlockedSection = () => {
    setExpandedSection((prev) => (prev === "blocked" ? null : "blocked"))
  }

  const togglePasswordSection = () => {
    setExpandedSection((prev) => (prev === "password" ? null : "password"))
  }

  const handleUnblock = async (userId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.patch(
        "/user/blocked-users",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setBlockedUsers((prev) => prev.filter((user) => user._id !== userId))
      toast.success("User unblocked.")
    } catch (err) {
      console.error("Error unblocking user:", err)
      toast.error("Failed to unblock user.")
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.")
      return
    }
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${API_URL}/changePassword`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      toast.success("Password changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setExpandedSection(null)
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error("Failed to change password. Please check your current password.")
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = () => {
 localStorage.removeItem("token");     // يمسح توكن المستخدم
  localStorage.removeItem("user");      // يمسح بيانات المستخدم
  window.location.reload();             // يعيد تحميل الصفحة
  navigate("/login");  
  }

  return (
    <motion.div 
      className="h-screen bg-black/20 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-6">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => navigate("/home")}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Appearance */}
        <motion.div 
          className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-3">
              <Palette className="w-5 h-5 text-sky-400" />
              <span>Appearance</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {theme === "dark" ? (
                  <Moon className="w-6 h-6 text-gray-400" />
                ) : (
                  <Sun className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <h4 className="font-medium text-white">Theme</h4>
                  <p className="text-sm text-gray-400">
                    {theme === "dark" ? "Dark mode" : "Light mode"}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={toggleTheme}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  theme === "dark" ? "bg-sky-500" : "bg-gray-600"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                  layout
                  transition={{ type: "spring", stiffness: 700, damping: 30 }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div 
          className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-3">
              <Lock className="w-5 h-5 text-sky-400" />
              <span>Privacy & Security</span>
            </h3>
          </div>
          <div className="divide-y divide-white/10">
            {/* Blocked Contacts Section */}
            <div>
              <motion.button
                onClick={toggleBlockedSection}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors flex justify-between items-center"
                whileTap={{ scale: 0.98 }}
              >
                <div>
                  <h4 className="font-medium text-white">Blocked contacts</h4>
                  <p className="text-sm text-gray-400">
                    Manage blocked users ({blockedUsers.length})
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: expandedSection === "blocked" ? 180 : 0 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {expandedSection === "blocked" && (
                  <motion.div
                    className="p-6 space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {blockedUsers.length === 0 ? (
                      <p className="text-sm text-gray-400">No blocked users</p>
                    ) : (
                      blockedUsers.map((blockedUser) => (
                        <motion.div
                          key={blockedUser._id}
                          className="flex items-center justify-between bg-white/5 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10"
                          whileHover={{ x: 4 }}
                        >
                          <div>
                            <h5 className="text-sm font-medium text-white">{blockedUser.fullName}</h5>
                            <p className="text-xs text-gray-400">{blockedUser.email}</p>
                          </div>
                          <motion.button
                            onClick={() => handleUnblock(blockedUser._id)}
                            className="p-2 rounded-full hover:bg-red-500/20 transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </motion.button>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Change Password Section */}
            <div>
              <motion.button
                onClick={togglePasswordSection}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors flex justify-between items-center"
                whileTap={{ scale: 0.98 }}
              >
                <div>
                  <h4 className="font-medium text-white">Change password</h4>
                  <p className="text-sm text-gray-400">Update your account password</p>
                </div>
                <motion.div
                  animate={{ rotate: expandedSection === "password" ? 180 : 0 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {expandedSection === "password" && (
                  <motion.form 
                    onSubmit={handleChangePassword} 
                    className="p-6 space-y-5"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-2xl transition-all shadow-2xl shadow-sky-500/25 backdrop-blur-sm border border-white/10"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Save Changes
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* General */}
        <motion.div 
          className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">General</h3>
          </div>
          <div className="divide-y divide-white/10">
            <motion.button 
              className="w-full p-6 text-left hover:bg-white/5 transition-colors flex items-center space-x-4"
              whileTap={{ scale: 0.98 }}
            >
              <Globe className="w-5 h-5 text-gray-400" />
              <div>
                <h4 className="font-medium text-white">Language</h4>
                <p className="text-sm text-gray-400">English</p>
              </div>
            </motion.button>
            <motion.button 
              className="w-full p-6 text-left hover:bg-white/5 transition-colors flex items-center space-x-4"
              whileTap={{ scale: 0.98 }}
            >
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <div>
                <h4 className="font-medium text-white">Help & Support</h4>
                <p className="text-sm text-gray-400">Get help and contact support</p>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div 
          className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={handleLogout}
            className="w-full p-6 text-left hover:bg-red-500/10 transition-colors flex items-center space-x-4"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <div>
              <h4 className="font-medium text-red-400">Sign Out</h4>
              <p className="text-sm text-red-400/80">Sign out of your account</p>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}