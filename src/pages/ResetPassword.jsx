import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { updatePasswordFinal } from '../services/AdminService';
import '../Styles/ResetPasswordStyles.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emailFromUrl = searchParams.get('email');

  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!emailFromUrl) {
      navigate('/login');
    }
  }, [emailFromUrl, navigate]);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (passwords.newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    const { success, error } = await updatePasswordFinal(emailFromUrl, passwords.newPassword);

    if (success) {
      setStatus('success');
      setTimeout(() => navigate('/login'), 3000);
    } else {
      alert("Error: " + error);
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="reset-container">
        <div className="reset-box success-box">
          <CheckCircle size={60} className="icon-success" />
          <h2>Contraseña Actualizada</h2>
          <p>Tu contraseña ha sido cambiada exitosamente.</p>
          <p className="redirect-text">Redirigiendo al Login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-container">
      <div className="reset-box">
        <div className="reset-header">
          <div className="icon-wrapper">
            <Lock size={30} className="icon-lock" />
          </div>
          <h2>Restablecer Contraseña</h2>
          <p className="email-display">Cuenta: {emailFromUrl}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group-reset">
            <label>Nueva Contraseña</label>
            <div className="password-wrapper">
              <input 
                type={showPass ? "text" : "password"} 
                name="newPassword" 
                placeholder="Mínimo 6 caracteres"
                value={passwords.newPassword}
                onChange={handleChange}
                required 
              />
              <button type="button" className="toggle-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group-reset">
            <label>Confirmar Contraseña</label>
            <input 
              type={showPass ? "text" : "password"} 
              name="confirmPassword" 
              placeholder="Repite la contraseña"
              value={passwords.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="btn-reset" disabled={loading}>
            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;