"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX, PhoneOff } from "lucide-react"

export default function AudioCallPage({ onNavigate, user }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
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
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent-blue rounded-full animate-pulse opacity-30" />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-accent-blue rounded-full animate-pulse opacity-20 delay-1000" />
        <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-accent-blue rounded-full animate-pulse opacity-25 delay-500" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => onNavigate("chat", { user })}
        className="absolute top-6 left-6 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-colors backdrop-blur-sm"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      {/* User Info */}
      <div className="text-center mb-12">
        <div className="relative mb-6">
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover mx-auto shadow-2xl shadow-black/50"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
        <p className="text-slate-300 text-lg mb-4">Audio Call</p>
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-6 py-3 inline-block">
          <span className="text-white font-mono text-xl">{formatTime(callDuration)}</span>
        </div>
      </div>

      {/* Call Controls */}
      <div className="flex items-center space-x-6">
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
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            isSpeakerOn
              ? "bg-accent-blue hover:bg-blue-600 shadow-2xl shadow-accent-blue/25"
              : "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
          }`}
        >
          {isSpeakerOn ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
        </button>

        <button
          onClick={handleEndCall}
          className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl shadow-red-500/25"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Status */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-6 py-3">
          <p className="text-slate-300 text-sm">Call in progress...</p>
        </div>
      </div>
    </div>
  )
}
