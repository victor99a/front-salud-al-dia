import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';
import MedicalRecords from './pages/MedicalRecords'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Rutas Públicas  --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />

        {/* --- Ruta de Onboarding --- */}
        <Route path="/ficha-medica" element={<MedicalRecords />} />

        {/* --- Rutas Privadas --- */}
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/historial" element={<HistoryPage />} />

        {/* --- Rutas Administrativas --- */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;
