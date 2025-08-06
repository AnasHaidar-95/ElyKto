"use client"

import { ArrowLeft, Phone, Video, MessageCircle, UserMinus, Shield, Bell } from "lucide-react"

export default function UserInfoPage({ onNavigate, user }) {
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">No user selected</p>
      </div>
    )
  }

  return (
    <div className="h-screen bg-surface-light dark:bg-surface-dark overflow-y-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate("chat", { user })}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Contact Info</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Profile Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="relative inline-block mb-4">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover mx-auto shadow-lg"
            />
            {user.online && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-800" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{user.name}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-1">sarah.johnson@email.com</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            {user.online ? "Online" : "Last seen 2 hours ago"}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate("audio-call", { user })}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl text-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <Phone className="w-6 h-6 text-accent-blue mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Call</span>
          </button>
          <button
            onClick={() => onNavigate("video-call", { user })}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl text-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <Video className="w-6 h-6 text-accent-blue mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Video</span>
          </button>
          <button
            onClick={() => onNavigate("chat", { user })}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl text-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <MessageCircle className="w-6 h-6 text-accent-blue mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</span>
          </button>
        </div>

        {/* About Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">About</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Product designer passionate about creating beautiful and functional user experiences. Love hiking,
            photography, and good coffee ☕
          </p>
        </div>

        {/* Media Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Media, Links and Docs</h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">12</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                <img
                  src={`/placeholder.svg?height=100&width=100&text=Photo${i}`}
                  alt={`Media ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center space-x-3">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span className="text-slate-800 dark:text-white">Mute notifications</span>
          </button>
          <button className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center space-x-3 border-t border-slate-200 dark:border-slate-700">
            <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span className="text-slate-800 dark:text-white">Block contact</span>
          </button>
          <button className="w-full p-4 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-3 border-t border-slate-200 dark:border-slate-700">
            <UserMinus className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-600 dark:text-red-400">Delete contact</span>
          </button>
        </div>
      </div>
    </div>
  )
}
