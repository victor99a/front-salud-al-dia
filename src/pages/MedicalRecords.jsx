import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMedicalRecord } from '../services/MedicalService'; 
import '../Styles/medicalRecordsStyles.css'; 
import logo from '../assets/logo.png';

const MedicalRecords = () => {
  const navigate = useNavigate();

  const [medicalData, setMedicalData] = useState({
    blood_type: '', 
    height: '', 
    initial_weight: '', 
    allergies: '', 
    chronic_diseases: '', 
    emergency_contact_name: '',
    data_processing_consent: false 
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token'); 

    if (!userId || !token) {
      alert("Acceso denegado. Por favor, inicia sesión o regístrate.");
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'height' && value > 300) return;
    if (name === 'initial_weight' && value > 600) return;

    setMedicalData({ 
        ...medicalData, 
        [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const onlyNums = value.replace(/[^0-9]/g, '');
    
    if (onlyNums.length <= 9) {
      setPhoneNumber(onlyNums);
      
      if (onlyNums.length === 9) {
          if (onlyNums.charAt(0) !== '9') {
             setPhoneError("El número debe comenzar con 9");
          } else {
             setPhoneError("");
          }
      } else {
          setPhoneError(""); 
      }
    }
  };

  const isFormValid = 
      medicalData.blood_type !== '' &&
      medicalData.height !== '' &&
      medicalData.initial_weight !== '' &&
      medicalData.emergency_contact_name !== '' &&
      phoneNumber.length === 9 &&
      phoneNumber.startsWith('9') &&
      medicalData.data_processing_consent === true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!medicalData.data_processing_consent) {
        alert("Debes aceptar los términos legales para continuar.");
        return;
    }

    if (phoneNumber.length !== 9 || !phoneNumber.startsWith('9')) {
        alert("El teléfono debe tener 9 dígitos y comenzar con 9.");
        return;
    }

    const userId = localStorage.getItem('user_id');
    const fullPhone = `+56${phoneNumber}`;

    const { data_processing_consent, ...datosLimpios } = medicalData;

    try {
      await createMedicalRecord({
        ...datosLimpios,
        emergency_contact_phone: fullPhone,
        user_id: userId
      });
      
      alert('¡Ficha médica creada exitosamente!');
      navigate('/dashboard'); 
    } catch (error) {
      alert('Error: ' + (error.message || 'No autorizado.'));
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
          
          <div className="form-group">
            <label>Tipo de Sangre</label>
            <select name="blood_type" value={medicalData.blood_type} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              <option value="A+">A+</option>
              <option value="O+">O+</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
              <option value="A-">A-</option>
              <option value="O-">O-</option>
              <option value="B-">B-</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div className="form-group">
             <label>Estatura (cm)</label>
             <input type="number" name="height" value={medicalData.height} placeholder="Ej: 170" onChange={handleChange} min="50" max="300" required />
          </div>

          <div className="form-group">
             <label>Peso Inicial (kg)</label>
             <input type="number" name="initial_weight" value={medicalData.initial_weight} placeholder="Ej: 75" onChange={handleChange} min="20" max="500" required />
          </div>

          <div className="form-group">
            <label>Contacto de Emergencia</label>
            <input type="text" name="emergency_contact_name" value={medicalData.emergency_contact_name} placeholder="Nombre completo" onChange={handleChange} required />
          </div>

          <div className="form-group full-width">
            <label>Teléfono de Emergencia</label>
            <div className={`phone-input-group ${phoneError ? 'input-error' : ''}`}>
              <div className="country-prefix">
                 +56
              </div>

              <input 
                type="tel" 
                name="emergency_contact_phone" 
                placeholder="9 1234 5678" 
                value={phoneNumber}
                onChange={handlePhoneChange}
                required 
                className="phone-field"
              />
            </div>
            {phoneError && <small className="error-text">{phoneError}</small>}
            <small className="hint-text">
                * Ingresa los 9 dígitos (ej: 987654321)
            </small>
          </div>

          <div className="form-group full-width">
            <label>Alergias</label>
            <textarea name="allergies" value={medicalData.allergies} placeholder="Medicamentos, alimentos..." onChange={handleChange}></textarea>
          </div>

          <div className="form-group full-width">
            <label>Enfermedades Crónicas</label>
            <textarea name="chronic_diseases" value={medicalData.chronic_diseases} placeholder="Diabetes, Hipertensión..." onChange={handleChange}></textarea>
          </div>
          
          <div className="form-group full-width checkbox-container">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="data_processing_consent" 
                checked={medicalData.data_processing_consent} 
                onChange={handleChange}
              />
              <span className="checkbox-text">
                Autorizo el tratamiento de mis datos sensibles de salud para fines de monitoreo y gestión médica, 
                en conformidad con la Ley 19.628 sobre Protección de la Vida Privada.
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn-medical"
            disabled={!isFormValid}
          >
            Finalizar y Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicalRecords;