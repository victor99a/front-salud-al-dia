import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';



function App() {
  return (
    <Router>
      <Routes>
        {/* HOME - TU PANTALLA */}
        <Route path="/" element={<HomePage />} />

        {/* PANTALLAS DE TU COMPAÑERO */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/historial" element={<HistoryPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/home" element={<HomePage />} />

      </Routes>
    </Router>
  );
}


export default App;
