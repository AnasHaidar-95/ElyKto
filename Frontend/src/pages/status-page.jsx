"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Eye } from "lucide-react"

const mockStatuses = [
  {
    id: 1,
    name: "My Status",
    time: "Tap to add status update",
    avatar: "/placeholder.svg?height=60&width=60",
    isOwn: true,
    hasStatus: false,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    time: "25 minutes ago",
    avatar: "/placeholder.svg?height=60&width=60",
    hasStatus: true,
    viewed: false,
  },
  {
    id: 3,
    name: "Mike Chen",
    time: "1 hour ago",
    avatar: "/placeholder.svg?height=60&width=60",
    hasStatus: true,
    viewed: true,
  },
  {
    id: 4,
    name: "Emma Wilson",
    time: "3 hours ago",
    avatar: "/placeholder.svg?height=60&width=60",
    hasStatus: true,
    viewed: false,
  },
  {
    id: 5,
    name: "Design Team",
    time: "5 hours ago",
    avatar: "/placeholder.svg?height=60&width=60",
    hasStatus: true,
    viewed: true,
  },
]

export default function StatusPage({ onNavigate }) {
  const [selectedStatus, setSelectedStatus] = useState(null)

  const handleStatusClick = (status) => {
    if (status.isOwn && !status.hasStatus) {
      // Add new status
      return
    }
    setSelectedStatus(status)
  }

  const closeStatusViewer = () => {
    setSelectedStatus(null)
  }

  if (selectedStatus) {
    return (
      <div className="h-screen bg-black relative overflow-hidden">
        {/* Status Background */}
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=800&width=400&text=Status+Image"
            alt="Status"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center space-x-3">
            <button
              onClick={closeStatusViewer}
              className="p-2 rounded-xl bg-black/30 hover:bg-black/50 transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <img
              src={selectedStatus.avatar || "/placeholder.svg"}
              alt={selectedStatus.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="text-white font-semibold">{selectedStatus.name}</h3>
              <p className="text-white/80 text-sm">{selectedStatus.time}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full w-full animate-pulse" />
          </div>
        </div>

        {/* Status Content */}
        <div className="absolute bottom-20 left-6 right-6">
          <p className="text-white text-lg font-medium">Beautiful sunset from my weekend trip! 🌅</p>
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-white/80" />
            <span className="text-white/80 text-sm">12 views</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-surface-light dark:bg-surface-dark">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate("home")}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Status</h1>
        </div>
      </div>

      <div className="overflow-y-auto">
        {/* My Status */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="p-4">
            <div
              onClick={() => handleStatusClick(mockStatuses[0])}
              className="flex items-center space-x-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl p-3 -m-3 transition-colors"
            >
              <div className="relative">
                <img
                  src={mockStatuses[0].avatar || "/placeholder.svg"}
                  alt="My Status"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-accent-blue rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 dark:text-white">My Status</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{mockStatuses[0].time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="p-4">
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-4">
            Recent Updates
          </h2>
          <div className="space-y-1">
            {mockStatuses.slice(1).map((status) => (
              <div
                key={status.id}
                onClick={() => handleStatusClick(status)}
                className="flex items-center space-x-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl p-3 transition-colors"
              >
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-full p-0.5 ${
                      status.viewed ? "bg-slate-300 dark:bg-slate-600" : "bg-gradient-to-r from-accent-blue to-blue-600"
                    }`}
                  >
                    <img
                      src={status.avatar || "/placeholder.svg"}
                      alt={status.name}
                      className="w-full h-full rounded-full object-cover bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-white">{status.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{status.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
