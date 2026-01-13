import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import HealthForm from './components/HealthForm'; // Importa el nuevo formulario

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Nueva ruta para el formulario de salud */}
        <Route path="/health" element={<HealthForm />} /> 
      </Routes>
    </Router>
  );
}

export default App;