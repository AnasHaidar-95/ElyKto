"use client"

import { useState } from "react"
import { ArrowLeft, Phone, Video, Users, Smile, Send } from "lucide-react"

const mockGroupMessages = [
  {
    id: 1,
    text: "Hey everyone! Ready for the design review?",
    sender: "Alice Johnson",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    time: "2:30 PM",
    isMe: false,
  },
  {
    id: 2,
    text: "Yes! I've prepared the latest mockups",
    sender: "me",
    time: "2:32 PM",
    isMe: true,
  },
  {
    id: 3,
    text: "Great! Can we start in 5 minutes?",
    sender: "Mike Chen",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    time: "2:33 PM",
    isMe: false,
  },
  {
    id: 4,
    text: "Perfect timing! I just finished the user flow diagrams",
    sender: "Sarah Wilson",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    time: "2:35 PM",
    isMe: false,
  },
  {
    id: 5,
    text: "Awesome work everyone! Let's do this 🚀",
    sender: "me",
    time: "2:36 PM",
    isMe: true,
  },
]

const groupMembers = [
  { name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40", online: true },
  { name: "Mike Chen", avatar: "/placeholder.svg?height=40&width=40", online: false },
  { name: "Sarah Wilson", avatar: "/placeholder.svg?height=40&width=40", online: true },
  { name: "You", avatar: "/placeholder.svg?height=40&width=40", online: true },
]

export default function GroupChatPage({ onNavigate, group }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(mockGroupMessages)
  const [showMembers, setShowMembers] = useState(false)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  if (!group) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">No group selected</p>
      </div>
    )
  }

  if (showMembers) {
    return (
      <div className="h-screen bg-surface-light dark:bg-surface-dark">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMembers(false)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Group Members</h1>
          </div>
        </div>

        {/* Members List */}
        <div className="p-4 space-y-4">
          {groupMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="relative">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {member.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 dark:text-white">{member.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {member.online ? "Online" : "Last seen 2h ago"}
                </p>
              </div>
              {member.name === "You" && (
                <span className="text-xs bg-accent-blue text-white px-2 py-1 rounded-full">You</span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-surface-light dark:bg-surface-dark">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate("home")}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors md:hidden"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <img
              src={group.avatar || "/placeholder.svg"}
              alt={group.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-slate-800 dark:text-white">{group.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{groupMembers.length} members</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Phone className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Video className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <button
              onClick={() => setShowMembers(true)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Users className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.isMe ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              {!msg.isMe && (
                <img
                  src={msg.senderAvatar || "/placeholder.svg"}
                  alt={msg.sender}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div>
                {!msg.isMe && <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 px-3">{msg.sender}</p>}
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.isMe
                      ? "bg-gradient-to-r from-accent-blue to-blue-600 text-white"
                      : "bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className="flex items-center justify-end mt-2">
                    <span className={`text-xs ${msg.isMe ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <button type="button" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Smile className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div className="flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-2xl text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-accent-blue focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-accent-blue to-blue-600 hover:from-blue-600 hover:to-accent-blue text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
