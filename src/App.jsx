import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import HealthForm from './components/HealthForm';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* HOME - TU PANTALLA */}
        <Route path="/" element={<HomePage />} />

        {/* PANTALLAS DE TU COMPAÑERO */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/health" element={<HealthForm />} />
      </Routes>
    </Router>
  );
}

export default App;
