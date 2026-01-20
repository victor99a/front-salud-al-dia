import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/medicalRecordsStyles.css'; 
import logo from '../assets/logo.png';

const MedicalRecords = () => {
  const navigate = useNavigate();

  // 1. CONFIGURACIÓN ÚNICA PARA CHILE
  // Dejamos el array por si en el futuro quieres expandirte a Perú o Argentina.
  const countryCodes = [
    { code: "+56", country: "CL 🇨🇱", max: 9 }, // Chile: 9 dígitos
  ];

  const [medicalData, setMedicalData] = useState({
    blood_type: '', height: '', initial_weight: '', 
    allergies: '', chronic_diseases: '', 
    emergency_contact_name: ''
  });

  // Estado del teléfono
  const [phoneCode, setPhoneCode] = useState("+56");
  const [phoneNumber, setPhoneNumber] = useState("");

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

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const onlyNums = value.replace(/[^0-9]/g, '');
    
    // Límite fijo de 9 dígitos para Chile
    if (onlyNums.length <= 9) {
      setPhoneNumber(onlyNums);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');

    // Validación estricta: Debe tener 9 dígitos (ej: 9 1234 5678)
    if (phoneNumber.length < 9) {
        alert('El número debe tener 9 dígitos. Ej: 912345678');
        return;
    }

    const fullPhone = `${phoneCode}${phoneNumber}`; // Quedará como +56912345678

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      await axios.post(`${API_URL}/medical/records`, {
        ...medicalData,
        emergency_contact_phone: fullPhone,
        user_id: userId
      });
      alert('¡Ficha médica completada con éxito!');
      navigate('/Dashboard'); 
    } catch (error) {
      console.error("Error al guardar:", error.response?.data || error.message);
      alert('Error al guardar la información médica.');
    }
  };

  return (
    <div className="medical-container">
      <div className="medical-box">
        <div className="medical-header">
          <img src={logo} alt="Salud Al Día" className="medical-logo" />
          <h2>Ficha Médica Inicial</h2>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          {/* ... OTROS CAMPOS (Sangre, Altura, Peso) SE MANTIENEN IGUAL ... */}
          <div className="form-group">
            <label>Tipo de Sangre</label>
            <select name="blood_type" onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              <option value="A+">A+</option><option value="O+">O+</option>
              <option value="B+">B+</option><option value="AB+">AB+</option>
              {/* Agrega negativos si gustas: A-, O-... */}
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
            <label>Contacto de Emergencia (Nombre)</label>
            <input type="text" name="emergency_contact_name" placeholder="Nombre completo" onChange={handleChange} required />
          </div>

          {/* INPUT TELÉFONO CHILE */}
          <div className="form-group full-width">
            <label>Teléfono de Emergencia</label>
            <div className="phone-input-group">
              
              {/* Selector bloqueado visualmente o con una sola opción */}
              <select 
                className="country-select"
                value={phoneCode}
                disabled // Deshabilitado porque solo hay una opción
                style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
              >
                {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                        {c.country} ({c.code})
                    </option>
                ))}
              </select>

              <input 
                type="tel" 
                name="emergency_contact_phone" 
                placeholder="9 1234 5678" 
                value={phoneNumber}
                onChange={handlePhoneChange}
                required 
              />
            </div>
            <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '5px', display: 'block' }}>
                * Ingresa los 9 dígitos sin espacios.
            </small>
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