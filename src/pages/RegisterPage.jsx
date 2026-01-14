import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link para navegación interna
import axios from 'axios';
import '../Styles/signUpStyles.css';
import logo from '../assets/logo.png'; // Importamos el mismo logo de assets

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', password: '', rut: '', first_names: '', last_names: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:3000/auth/signup', formData);
    
    // Basado en tu captura de Network:
    // La respuesta contiene el objeto "user" y el "message"
    console.log("Respuesta exitosa:", response.data);

    // Si tu microservicio no devuelve la sesión completa, 
    // usaremos el ID del usuario recién creado para permitir el acceso a la ficha
    if (response.data.user || response.data.data?.user) {
      const user = response.data.user || response.data.data.user;
      
      localStorage.setItem('user_id', user.id);
      // Guardamos un flag temporal si no hay token aún, para que MedicalRecords te deje pasar
      localStorage.setItem('temp_access', 'true'); 

      alert('¡Cuenta creada con éxito! Vamos a completar tu ficha médica.');
      navigate('/ficha-medica'); 
    }
  } catch (error) {
    console.error("Detalle del error:", error.response?.data || error.message);
    alert('Error: ' + (error.response?.data?.error || 'No se pudo crear la cuenta'));
  }
};

  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* Encabezado con el Logo */}
        <div className="signup-header">
          <img 
            src={logo} 
            alt="Salud Al Día" 
            className="signup-logo" 
          />
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>RUT</label>
            <input type="text" name="rut" placeholder="12.345.678-9" onChange={handleChange} required />
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