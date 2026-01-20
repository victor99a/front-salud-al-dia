import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import HealthRegisterPage from "./pages/HealthRegisterPage";
import MedicalRecords from "./pages/MedicalRecords";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import ResetPassword from "./pages/ResetPassword";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import ChatWidget from "./components/Chat/ChatWidget";
import { isAdmin } from "./services/AuthService";

function App() {
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('user_id'));
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const savedId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');
      
      if (savedId !== currentUserId) {
        setCurrentUserId(savedId);
      }

      if (token) {
        const adminStatus = await isAdmin();
        setIsUserAdmin(adminStatus);
      } else {
        setIsUserAdmin(false);
      }
    };

    window.addEventListener('storage', checkUser);
    const interval = setInterval(checkUser, 1000);

    return () => {
      window.removeEventListener('storage', checkUser);
      clearInterval(interval);
    };
  }, [currentUserId]);

  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/historial" element={<HistoryPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/registro-salud" element={<HealthRegisterPage />} />
        <Route path="/ficha-medica" element={<MedicalRecords />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {currentUserId && !isUserAdmin && <ChatWidget userId={currentUserId} />}
      
    </Router>
  );
}

export default App;