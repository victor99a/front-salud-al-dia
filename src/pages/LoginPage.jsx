import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../Styles/loginStyles.css';
import logo from '../assets/logo.png'; 

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const data = response.data;

      const token = data.session?.access_token || data.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      
      localStorage.setItem('user_email', credentials.email); 

      let userId = null;
      let userData = null;

      if (data.user && data.user.id) {
          userId = data.user.id;
          userData = data.user;
      } else if (data.session && data.session.user && data.session.user.id) {
          userId = data.session.user.id;
          userData = data.session.user;
      }

      if (userId) {
          localStorage.setItem('user_id', userId);
          
          if (userData) {
             const meta = userData.user_metadata || {};
             const firstName = meta.first_names || "Usuario";
             const lastName = meta.last_names || "";
             localStorage.setItem('user_name', `${firstName} ${lastName}`.trim());
          }

          window.dispatchEvent(new Event("storage"));
      }

      navigate('/Dashboard');
    } catch (error) {
      alert('Error: Credenciales incorrectas o problema de conexión');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={logo} alt="Salud Al Día" className="login-logo"/>
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
          ¿No tiene una cuenta? <Link to="/signup">Regístrese aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;