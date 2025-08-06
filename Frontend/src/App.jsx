import { useEffect } from "react";
import { ThemeProvider } from "./pages/theme-provider.jsx";
import LandingPage from "./pages/landing-page.jsx";
import LoginPage from "./pages/login-page.jsx";
import RegisterPage from "./pages/register-page.jsx";
import HomePage from "./pages/home-page.jsx";
import ChatPage from "./pages/chat-page.jsx";
import AudioCallPage from "./pages/audio-call-page.jsx";
import VideoCallPage from "./pages/video-call-page.jsx";
import UserInfoPage from "./pages/user-info-page.jsx";
import MyProfilePage from "./pages/my-profile-page.jsx";
import StatusPage from "./pages/status-page.jsx";
import SettingsPage from "./pages/settings-page.jsx";
import GroupChatPage from "./pages/group-chat-page.jsx";
import { Route, Routes, Navigate } from "react-router-dom";
import { socket } from "./socket.js";
import { Toaster } from "react-hot-toast";
export default function App() {
  const token = localStorage.getItem("token");

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Toaster position="top-right" />
      <Routes>
        {/* الصفحة الرئيسية: عرض Landing أو توجيه حسب التوكن */}
        <Route
          path="/"
          element={token ? <Navigate to="/home" replace /> : <LandingPage />}
        />

        {/* صفحات الدخول والتسجيل */}
        <Route
          path="/login"
          element={!token ? <LoginPage /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/register"
          element={!token ? <RegisterPage /> : <Navigate to="/home" replace />}
        />

        {/* صفحات محمية بالتوكن */}
        <Route
          path="/home"
          element={token ? <HomePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={token ? <MyProfilePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/setting"
          element={token ? <SettingsPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/audio"
          element={token ? <AudioCallPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/video"
          element={token ? <VideoCallPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/userinfo"
          element={token ? <UserInfoPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/group"
          element={token ? <GroupChatPage /> : <Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}
