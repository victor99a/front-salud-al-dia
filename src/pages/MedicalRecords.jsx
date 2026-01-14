import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/medicalRecordsStyles.css'; 
import logo from '../assets/logo.png';

const MedicalRecords = () => {
  const navigate = useNavigate();
  const [medicalData, setMedicalData] = useState({
    blood_type: '', height: '', initial_weight: '', 
    allergies: '', chronic_diseases: '', 
    emergency_contact_name: '', emergency_contact_phone: ''
  });

  // Seguridad: Redirigir si no hay sesión activa
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert("Acceso denegado. Por favor, regístrate primero.");
      navigate('/signup');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setMedicalData({ ...medicalData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');

    try {
      await axios.post('http://localhost:3000/medical/records', {
        ...medicalData,
        user_id: userId
      });
      alert('¡Ficha médica completada con éxito!');
      navigate('/Dashboard'); 
    } catch (error) {
      // Error capturado en consola si la ruta falla
      console.error("Error al guardar:", error.response?.data);
      alert('Error al guardar la información médica.');
    }
  };

  return (
    <div className="medical-container">
      <div className="medical-box">
        <div className="medical-header">
          <img src={logo} alt="Salud Al Día" className="medical-logo" />
          <h2>Ficha Médica Inicial</h2>
          <p>Estos datos permiten a la IA dar consejos precisos.</p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Tipo de Sangre</label>
            <select name="blood_type" onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              <option value="A+">A+</option><option value="O+">O+</option>
              <option value="B+">B+</option><option value="AB+">AB+</option>
            </select>
          </div>
          <div className="form-group">
            <label>Estatura (cm)</label>
            <input type="number" name="height" placeholder="Ej: 170" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Peso Inicial (kg)</label>
            <input type="number" name="initial_weight" placeholder="Ej: 75" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contacto de Emergencia</label>
            <input type="text" name="emergency_contact_name" placeholder="Nombre" onChange={handleChange} required />
          </div>
          <div className="form-group full-width">
            <label>Teléfono de Emergencia</label>
            <input type="tel" name="emergency_contact_phone" placeholder="+569..." onChange={handleChange} required />
          </div>
          <div className="form-group full-width">
            <label>Alergias</label>
            <textarea name="allergies" placeholder="Medicamentos, alimentos..." onChange={handleChange}></textarea>
          </div>
          <div className="form-group full-width">
            <label>Enfermedades Crónicas</label>
            <textarea name="chronic_diseases" placeholder="Diabetes, Hipertensión..." onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="btn-medical">Finalizar y Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default MedicalRecords;