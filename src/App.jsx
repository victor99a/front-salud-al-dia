import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContactPage from "./pages/ContactPage"
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import HealthRegisterPage from "./pages/HealthRegisterPage";
import MedicalRecords from "./pages/MedicalRecords";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import ResetPassword from "./pages/ResetPassword";

function App() {
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

        <Route path="/ficha-medica" element={<MedicalRecords />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/historial" element={<HistoryPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/registro-salud" element={<HealthRegisterPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;