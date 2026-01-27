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
import SpecialistDashboard from "./pages/SpecialistDashboard";
import PatientFile from "./pages/PatientFile";

import Navbar from "./components/Navbar";
import ChatWidget from "./components/Chat/ChatWidget";
import Loader from "./components/Loader"; 
import { isAdmin } from "./services/AuthService";

import PatientGuard from "./components/Guards/PatientGuard";
import SpecialistGuard from "./components/Guards/SpecialistGuard";
import AdminGuard from "./components/Guards/AdminGuard";

function App() {
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('user_id'));
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role'));
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const refreshAppState = async () => {
      setIsAuthChecking(true);
      
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
      
      setTimeout(() => {
          setIsAuthChecking(false);
      }, 1500); 
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

  if (isAuthChecking) {
    return <Loader message="Verificando credenciales y permisos..." />;
  }

  return (
    <Router>
      <Navbar 
        isUserAdmin={isUserAdmin} 
        userRole={userRole} 
      />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route 
          path="/dashboard" 
          element={
            <PatientGuard>
              <Dashboard />
            </PatientGuard>
          } 
        />
        <Route 
          path="/historial" 
          element={
            <PatientGuard>
              <HistoryPage />
            </PatientGuard>
          } 
        />
        <Route 
          path="/perfil" 
          element={
            <PatientGuard>
              <ProfilePage />
            </PatientGuard>
          } 
        />
        <Route 
          path="/registro-salud" 
          element={
            <PatientGuard>
              <HealthRegisterPage />
            </PatientGuard>
          } 
        />
        <Route 
          path="/ficha-medica" 
          element={
            <PatientGuard>
              <MedicalRecords />
            </PatientGuard>
          } 
        />

        <Route 
            path="/panel-medico" 
            element={
                <SpecialistGuard>
                    <SpecialistDashboard />
                </SpecialistGuard>
            } 
        />
        <Route 
            path="/paciente/:id" 
            element={
                <SpecialistGuard>
                    <PatientFile />
                </SpecialistGuard>
            } 
        />

        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminPage />
            </AdminGuard>
          }
        />
      </Routes>

      {!isAuthChecking && currentUserId && !isUserAdmin && userRole !== 'specialist' && (
        <ChatWidget userId={currentUserId} />
      )}
      
    </Router>
  );
}

export default App;