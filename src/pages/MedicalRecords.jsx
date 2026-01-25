import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMedicalRecord } from '../services/MedicalService';
import '../Styles/medicalRecordsStyles.css'; 
import logo from '../assets/logo.png';

const MedicalRecords = () => {
  const navigate = useNavigate();

  const countryCodes = [
    { code: "+56", country: "Chile", max: 9 }, 
  ];

  const [medicalData, setMedicalData] = useState({
    blood_type: '', 
    height: '', 
    initial_weight: '', 
    allergies: '', 
    chronic_diseases: '', 
    emergency_contact_name: ''
  });

  const [phoneCode, setPhoneCode] = useState("+56");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token'); 

    if (!userId || !token) {
      alert("Acceso denegado. Por favor, regístrate nuevamente.");
      navigate('/signup');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setMedicalData({ ...medicalData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const onlyNums = value.replace(/[^0-9]/g, '');
    if (onlyNums.length <= 9) {
      setPhoneNumber(onlyNums);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');

    if (phoneNumber.length < 9) {
        alert('El número debe tener 9 dígitos. Ej: 912345678');
        return;
    }

    const fullPhone = `${phoneCode}${phoneNumber}`; 

    try {
      await createMedicalRecord({
        ...medicalData,
        emergency_contact_phone: fullPhone,
        user_id: userId
      });

      alert('Ficha médica completada con éxito.');
      navigate('/dashboard'); 
    } catch (error) {
      alert('Error al guardar la información médica: ' + error.message);
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
            <select name="blood_type" onChange={handleChange} required>
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

          <div className="form-group full-width">
            <label>Teléfono de Emergencia</label>
            <div className="phone-input-group">
              <select 
                className="country-select"
                value={phoneCode}
                disabled 
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
            <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '5px', display: 'block' }}>
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