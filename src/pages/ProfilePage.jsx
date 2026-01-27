import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Ruler, AlertTriangle, Phone, AlertCircle, Save, X } from 'lucide-react';
import { getMedicalRecord, updateMedicalRecord } from '../services/MedicalService'; 
import { requestAccountDeletion } from '../services/AdminService';
import '../Styles/ProfileStyles.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Mi Perfil"); 
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [phoneEdit, setPhoneEdit] = useState("");

  const fetchProfile = async () => {
    const userId = localStorage.getItem('user_id');
    const storedName = localStorage.getItem('user_name');
    
    if (storedName) setUserName(storedName);
    if (!userId) { navigate('/login'); return; }

    try {
      const data = await getMedicalRecord(userId);
      setProfile(data);
      
      const initialForm = data || {};
      setFormData(initialForm);

      if (initialForm.emergency_contact_phone) {
          const rawPhone = initialForm.emergency_contact_phone.toString();
          setPhoneEdit(rawPhone.replace(/^\+56/, ''));
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'height' && (value < 0 || value > 300)) return;
    if (name === 'initial_weight' && (value < 0 || value > 600)) return;

    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneEditChange = (e) => {
      const val = e.target.value.replace(/[^0-9]/g, '');
      if (val.length <= 9) {
          setPhoneEdit(val);
      }
  };

  const handleSave = async () => {
    if (phoneEdit.length !== 9 || !phoneEdit.startsWith('9')) {
        alert("El teléfono de emergencia debe tener 9 dígitos y comenzar con 9.");
        return;
    }

    try {
      const userId = localStorage.getItem('user_id');
      
      const finalPhone = `+56${phoneEdit}`;

      const payload = {
        ...formData,
        emergency_contact_phone: finalPhone,
        current_weight: formData.initial_weight 
      };

      await updateMedicalRecord(userId, payload);
      
      setProfile(payload);
      setFormData(payload);
      setIsEditing(false);  
      alert("¡Perfil actualizado!");
    } catch (error) {
      alert("Error al guardar cambios: " + error.message);
    }
  };

  const confirmDeletion = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    const { success, error } = await requestAccountDeletion(userId);

    if (success) {
      setShowDeleteModal(false);
      alert("Solicitud enviada correctamente.");
    } else {
      alert("Error: " + error);
    }
  };

  if (loading) return <div className="loading-container">Cargando...</div>;
  
  if (!profile) return (
    <div className="profile-container">
        <div className="empty-state">
          <h2>Ficha médica no encontrada</h2>
          <p>Hola <b>{userName}</b>, necesitamos tus datos para comenzar.</p>
          <Link to="/ficha-medica" className="btn-create-record">Crear Ficha Médica</Link>
        </div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <User size={40} />
        </div>
        <div className="profile-title">
          <h1 style={{textTransform: 'capitalize'}}>{userName}</h1>
          <p>Información Médica Personal</p>
        </div>
        {!isEditing && (
          <button className="btn-edit" onClick={() => setIsEditing(true)}>Editar</button>
        )}
      </div>

      <div className="profile-grid">
        <div className="info-card">
          <div className="card-header">
            <Ruler size={24} color="#2563eb" />
            <h3>Datos Corporales</h3>
          </div>
          <div className="info-item">
            <span className="info-label">Estatura (cm)</span>
            {isEditing ? <input type="number" name="height" value={formData.height} onChange={handleChange} className="form-input-edit" /> : <span className="info-value">{profile.height} cm</span>}
          </div>
          <div className="info-item">
            <span className="info-label">Peso (kg)</span>
            {isEditing ? <input type="number" name="initial_weight" value={formData.initial_weight} onChange={handleChange} className="form-input-edit" /> : <span className="info-value">{profile.initial_weight} kg</span>}
          </div>
           <div className="info-item">
            <span className="info-label">Grupo Sanguíneo</span>
             {isEditing ? (
              <select name="blood_type" value={formData.blood_type} onChange={handleChange} className="form-input-edit">
                  <option value="A+">A+</option>
                  <option value="O+">O+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="A-">A-</option>
                  <option value="O-">O-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
              </select>
            ) : <span className="info-value">{profile.blood_type}</span>}
          </div>
        </div>

        <div className="info-card">
          <div className="card-header">
            <AlertTriangle size={24} color="#2563eb" />
            <h3>Alertas Médicas</h3>
          </div>
          <div className="info-item">
            <span className="info-label">Alergias</span>
            {isEditing ? <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} className="form-input-edit" /> : <span className="info-value">{profile.allergies || 'Ninguna'}</span>}
          </div>
          <div className="info-item">
            <span className="info-label">Enf. Crónicas</span>
             {isEditing ? <input type="text" name="chronic_diseases" value={formData.chronic_diseases} onChange={handleChange} className="form-input-edit" /> : <span className="info-value">{profile.chronic_diseases || 'Ninguna'}</span>}
          </div>
        </div>

        <div className="info-card">
          <div className="card-header">
            <Phone size={24} color="#2563eb" />
            <h3>Emergencia</h3>
          </div>
          <div className="info-item">
            <span className="info-label">Nombre Contacto</span>
             {isEditing ? <input type="text" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} className="form-input-edit" /> : <span className="info-value">{profile.emergency_contact_name}</span>}
          </div>
          <div className="info-item">
            <span className="info-label">Teléfono (+56)</span>
             {isEditing ? (
                <div className="phone-edit-wrapper">
                    <span className="prefix-span">+56</span>
                    <input 
                        type="tel" 
                        value={phoneEdit} 
                        onChange={handlePhoneEditChange} 
                        className="form-input-edit phone-input" 
                        placeholder="9XXXXXXXX"
                    />
                </div>
             ) : (
                <span className="info-value phone-display">{profile.emergency_contact_phone}</span>
             )}
          </div>
        </div>
      </div>
      
      {!isEditing && (
        <div className="danger-zone">
          <div className="danger-content">
            <h3>Eliminar Cuenta</h3>
            <p>Esta acción solicitará el borrado permanente de tus datos.</p>
          </div>
          <button className="btn-request-delete" onClick={() => setShowDeleteModal(true)}>Solicitar Eliminación</button>
        </div>
      )}

      {isEditing && (
        <div className="edit-actions">
          <button onClick={handleSave} className="btn-create-record">
              <Save size={18} style={{marginRight: '5px'}}/> Guardar Cambios
          </button>
          <button onClick={() => { setIsEditing(false); setFormData(profile); setPhoneEdit(profile.emergency_contact_phone?.replace(/^\+56/, '')); }} className="btn-cancel-edit">
              <X size={18} style={{marginRight: '5px'}}/> Cancelar
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <div className="modal-icon-warning">
              <AlertCircle size={32} color="#dc2626" />
            </div>
            <h3>¿Confirmar solicitud?</h3>
            <p>Un administrador revisará la solicitud para borrar tus datos permanentemente.</p>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button className="btn-modal-confirm" onClick={confirmDeletion}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;