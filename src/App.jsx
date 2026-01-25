import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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
import SpecialistDashboard from "./pages/SpecialistDashboard";
import PatientFile from "./pages/PatientFile";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import ChatWidget from "./components/Chat/ChatWidget";
import { isAdmin } from "./services/AuthService";

const SpecialistRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('user_role');
    
    if (!token) return <Navigate to="/login" />;
    if (role !== 'specialist' && role !== 'admin') return <Navigate to="/dashboard" />;
    
    return children;
};

function App() {
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('user_id'));
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role'));

  const refreshAppState = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      const role = localStorage.getItem('user_role');

      setCurrentUserId(userId);
      setUserRole(role);

      if (token && userId) {
        try {
            const adminStatus = await isAdmin();
            setIsUserAdmin(adminStatus);
        } catch {
            setIsUserAdmin(false);
        }
      } else {
        setIsUserAdmin(false);
      }
  };

  useEffect(() => {
    refreshAppState();
    window.addEventListener('auth-change', refreshAppState);
    window.addEventListener('storage', refreshAppState);

    return () => {
        window.removeEventListener('auth-change', refreshAppState);
        window.removeEventListener('storage', refreshAppState);
    };
  }, []);

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
            path="/panel-medico" 
            element={
                <SpecialistRoute>
                    <SpecialistDashboard />
                </SpecialistRoute>
            } 
        />
        <Route 
            path="/paciente/:id" 
            element={
                <SpecialistRoute>
                    <PatientFile />
                </SpecialistRoute>
            } 
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {currentUserId && !isUserAdmin && userRole !== 'specialist' && (
        <ChatWidget userId={currentUserId} />
      )}
      
    </Router>
  );
}

export default App;