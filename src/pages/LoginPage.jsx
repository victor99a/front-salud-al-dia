import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { requestPublicPasswordReset } from '../services/AuthService';
import '../Styles/loginStyles.css';
import logo from '../assets/logo.png'; 

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState({ loading: false, msg: '', type: '' });
  const [cooldownTime, setCooldownTime] = useState(0); 
  
  const navigate = useNavigate();

  useEffect(() => {
    const lockUntil = localStorage.getItem('reset_lock_until');
    if (lockUntil) {
      const now = Date.now();
      const timeLeft = Math.ceil((parseInt(lockUntil) - now) / 1000);
      if (timeLeft > 0) {
        setCooldownTime(timeLeft);
      } else {
        localStorage.removeItem('reset_lock_until');
      }
    }
  }, []);

  useEffect(() => {
    if (cooldownTime <= 0) return;
    const timer = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('reset_lock_until');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownTime]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const data = response.data;
      const token = data.session?.access_token || data.token;
      
      if (token) localStorage.setItem('token', token);
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

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (cooldownTime > 0) return;

    setResetStatus({ loading: true, msg: '', type: '' });
    const result = await requestPublicPasswordReset(resetEmail);
    setResetStatus({ loading: false });

    if (result.success) {
      setResetStatus({ msg: '¡Enlace enviado! Revisa tu correo.', type: 'success' });
      const secondsToWait = 300; 
      setCooldownTime(secondsToWait);
      const unlockTime = Date.now() + (secondsToWait * 1000);
      localStorage.setItem('reset_lock_until', unlockTime.toString());
    } else {
      setResetStatus({ msg: result.error || 'Error al enviar.', type: 'error' });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
            <input type="email" name="email" placeholder="ejemplo@correo.com" onChange={handleChange} required />
          </div>
          <div className="input-group-login">
            <label>Contraseña</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <div className="forgot-password-link">
             <button type="button" onClick={() => setShowResetModal(true)} className="btn-link">
               ¿Olvidaste tu contraseña?
             </button>
          </div>

          <button type="submit" className="btn-login">Entrar al Panel</button>
        </form>

        <p className="auth-footer">
          ¿No tiene una cuenta? <Link to="/signup">Regístrese aquí</Link>
        </p>
      </div>

      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Recuperar Contraseña</h3>
            <p>Ingresa tu correo y te enviaremos un enlace.</p>
            
            <form onSubmit={handleResetSubmit}>
              <input 
                type="email" 
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                className="input-reset"
                disabled={cooldownTime > 0}
              />
              
              {resetStatus.msg && (
                <p className={`status-msg ${resetStatus.type}`}>{resetStatus.msg}</p>
              )}

              {cooldownTime > 0 && (
                <p style={{color: '#d97706', fontWeight: 'bold', fontSize: '0.9rem'}}>
                  Espera {formatTime(cooldownTime)} para intentar de nuevo.
                </p>
              )}

              <div className="modal-actions">
                <button type="button" onClick={() => setShowResetModal(false)} className="btn-cancel">
                  {cooldownTime > 0 ? 'Cerrar' : 'Cancelar'}
                </button>
                
                <button 
                  type="submit" 
                  className={`btn-confirm ${cooldownTime > 0 ? 'disabled' : ''}`}
                  disabled={resetStatus.loading || cooldownTime > 0}
                >
                  {resetStatus.loading ? 'Enviando...' : cooldownTime > 0 ? 'Espera...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;