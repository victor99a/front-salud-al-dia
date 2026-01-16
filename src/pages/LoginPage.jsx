import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../Styles/loginStyles.css';
import logo from '../assets/logo.png'; 

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };  

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const response = await axios.post(`${API_URL}/auth/login`, credentials);

    const token = response.data.session?.access_token;
    const userId = response.data.session?.user?.id;

    if (!token || !userId) {
      throw new Error("No se recibió token o user_id");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user_id", userId);

    alert("¡Bienvenido a Salud Al Día!");
    navigate("/Dashboard");

  } catch (error) {
    console.error("Error en login:", error.message);
    alert("Error: Verifique sus credenciales");
  }
};

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Encabezado limpio: Solo el Logo */}
        <div className="login-header">
          <img 
            src={logo} 
            alt="Salud Al Día" 
            className="login-logo"
          />
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="input-group-login">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              name="email" 
              placeholder="ejemplo@correo.com" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group-login">
            <label>Contraseña</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="btn-login">
            Entrar al Panel
          </button>
        </form>

        <p className="auth-footer">
          ¿Es nuevo aquí? <Link to="/signup">Crear una cuenta</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;