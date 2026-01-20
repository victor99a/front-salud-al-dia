import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../Styles/signUpStyles.css';
import logo from '../assets/logo.png';
import { formatRut, isValidEmail } from "../utils/validations";

const Signup = () => {
  const navigate = useNavigate();
  
  const [error, setError] = useState(""); 
  
  const [formData, setFormData] = useState({
    email: '', password: '', rut: '', first_names: '', last_names: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(error) setError(""); 
  };

  const handleRutChange = (e) => {
    const inputValue = e.target.value;
    
    if (inputValue.length > 12) return;

    setFormData({
      ...formData,
      rut: formatRut(inputValue) 
    });
    if(error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    if (!isValidEmail(formData.email)) {
      setError("❌ El correo electrónico no es válido.");
      return;
    }

    if (formData.rut.length < 8) {
      setError("❌ El RUT parece incompleto.");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/auth/signup`, formData);
      
      console.log("Respuesta exitosa:", response.data);

      if (response.data.user || response.data.data?.user) {
        const user = response.data.user || response.data.data.user;
        
        localStorage.setItem('user_id', user.id);
        localStorage.setItem('temp_access', 'true'); 

        alert('¡Cuenta creada con éxito!'); 
        navigate('/ficha-medica'); 
      }
    } catch (error) {
      console.error("Detalle del error:", error.response?.data || error.message);
      setError(error.response?.data?.error || 'Error al crear la cuenta. Intenta nuevamente.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <img src={logo} alt="Salud Al Día" className="signup-logo" />
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>RUT</label>
            <input 
              type="text" 
              name="rut" 
              placeholder="12.345.678-9" 
              value={formData.rut}
              onChange={handleRutChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Nombres</label>
            <input type="text" name="first_names" placeholder="Juan Ignacio" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Apellidos</label>
            <input type="text" name="last_names" placeholder="Pérez Soto" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="correo@ejemplo.com" onChange={handleChange} required />
          </div>
          
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Contraseña</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>
          {error && (
            <div style={{ gridColumn: 'span 2', color: 'red', textAlign: 'center', marginBottom: '10px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-signup">Crear Cuenta</button>
        </form>

        <p className="signup-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;