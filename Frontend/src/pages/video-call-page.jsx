"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Mic, MicOff, Video, VideoOff, PhoneOff, RotateCcw } from "lucide-react"

export default function VideoCallPage({ onNavigate, user }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEndCall = () => {
    onNavigate("chat", { user })
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">No user selected</p>
      </div>
    )
  }

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* Remote Video Background */}
      <div className="absolute inset-0">
        <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate("chat", { user })}
            className="p-3 rounded-xl bg-black/30 hover:bg-black/50 transition-colors backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="text-center">
            <h2 className="text-white font-semibold text-lg">{user.name}</h2>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1 mt-1">
              <span className="text-white font-mono text-sm">{formatTime(callDuration)}</span>
            </div>
          </div>
          <div className="w-12" /> {/* Spacer */}
        </div>
      </div>

      {/* Local Video */}
      <div className="absolute top-20 right-6 w-32 h-40 bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
        {isVideoOn ? (
          <img src="/placeholder.svg?height=160&width=128" alt="You" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
            <VideoOff className="w-8 h-8 text-slate-400" />
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${
              isMuted
                ? "bg-red-500 hover:bg-red-600 shadow-2xl shadow-red-500/25"
                : "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${
              !isVideoOn
                ? "bg-red-500 hover:bg-red-600 shadow-2xl shadow-red-500/25"
                : "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            }`}
          >
            {isVideoOn ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
          </button>

          <button className="p-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-110 active:scale-95">
            <RotateCcw className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl shadow-red-500/25"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
