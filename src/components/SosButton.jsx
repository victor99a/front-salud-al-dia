import React, { useState } from 'react';
import '../Styles/SosButtonStyles.css';

const SosButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [contactPhone, setContactPhone] = useState(null);
  const [loading, setLoading] = useState(false);

  const USER_ID = localStorage.getItem('user_id'); 

  const handleSOSClick = async () => {
    if (!USER_ID) {
      alert("Error: No se detectó sesión de usuario.");
      return;
    }

    setLoading(true);
    try {
      const API_SOS_URL = import.meta.env.VITE_API_SOS_URL || 'http://localhost:3000';
      
      const response = await fetch(`${API_SOS_URL}/api/sos/emergency-contact/${USER_ID}`);
      const data = await response.json();

      if (data.success) {
        setContactPhone(data.phone);
        setShowModal(true);
      }
    } catch (err) {
      console.error("Error conectando al servicio SOS:", err);
      alert("El servicio de emergencia no está disponible en este momento.");
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (contactPhone) window.location.href = `tel:${contactPhone}`;
  };

  const handleWhatsApp = () => {
    if (contactPhone) {
      const cleanNum = contactPhone.replace('+', '');
      const message = encodeURIComponent("🚨 ¡EMERGENCIA! Necesito ayuda urgente.");
      window.open(`https://wa.me/${cleanNum}?text=${message}`, '_blank');
    }
  };

  return (
    <>
      <button className="sos-button-final" onClick={handleSOSClick} disabled={loading} aria-label="Emergencia SOS">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" x2="12" y1="8" y2="12"></line>
          <line x1="12" x2="12.01" y1="16" y2="16"></line>
        </svg>
        <span>{loading ? '...' : 'SOS'}</span>
      </button>

      {showModal && (
        <div className="sos-modal-overlay">
          <div className="sos-modal-content">
            <div className="sos-modal-icon">🚨</div>
            <h3>Ayuda de Emergencia</h3>
            <p className="sos-info-text">Selecciona una opción para contactar a tu enlace de confianza:</p>
            
            <div className="phone-display-box">
              <span className="phone-number">{contactPhone}</span>
            </div>
            
            <div className="sos-modal-actions-list">
              <button className="btn-whatsapp-action" onClick={handleWhatsApp}>
                💬 Enviar WhatsApp
              </button>

              <button className="btn-call-action" onClick={handleCall}>
                📞 Llamar por Teléfono
              </button>

              <button className="btn-cancel-action" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SosButton;