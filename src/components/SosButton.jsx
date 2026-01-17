import React, { useState } from "react";
import "../Styles/SosButtonStyles.css";

const SosButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [contactPhone, setContactPhone] = useState(null);
  const [loading, setLoading] = useState(false);

  const USER_ID = localStorage.getItem('user_id'); 

  const handleSOSClick = async () => {
    if (!USER_ID) {
      alert("⚠️ Error: Debes iniciar sesión.");
      return;
    }

    setLoading(true);
    try {
      const API_SOS_URL = import.meta.env.VITE_API_SOS_URL || 'http://localhost:3000';
      
      const response = await fetch(`${API_SOS_URL}/api/sos/emergency-contact/${USER_ID}`);
      
      // Validación extra por si el servidor falla (500, 404, etc)
      if (!response.ok) throw new Error("Error en la petición");

      const data = await response.json();

      // --- CORRECCIÓN 1: Avisar si no hay contacto ---
      if (data.success && data.phone) {
        setContactPhone(data.phone);
        setShowModal(true);
      } else {
        alert("⚠️ No tienes un contacto de emergencia configurado. Por favor ve a 'Mi Perfil' y agrégalo.");
      }

    } catch (err) {
      console.error("Error conectando al servicio SOS:", err);
      alert("❌ Error de conexión. Llama al 131 manualmente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (contactPhone) window.location.href = `tel:${contactPhone}`;
  };

  const handleWhatsApp = () => {
    if (contactPhone) {
      // --- CORRECCIÓN 2: Limpieza profunda del número ---
      // /\D/g significa "todo lo que NO sea dígito".
      // Esto convierte "+56 9-1234 5678" en "56912345678" (Perfecto para la API de WA)
      const cleanNum = contactPhone.replace(/\D/g, ''); 
      
      const message = encodeURIComponent("🚨 ¡EMERGENCIA! Necesito ayuda urgente. Alerta enviada desde Salud Al Día.");
      window.open(`https://wa.me/${cleanNum}?text=${message}`, '_blank');
    }
  };

  return (
    <>
      <button 
        className={`sos-button-final ${loading ? 'loading-pulse' : ''}`} 
        onClick={handleSOSClick} 
        disabled={loading}
      >
        <div className="icon-container">
            {/* SVG simple de alerta */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
        </div>
        <span>{loading ? 'CONECTANDO...' : 'SOS'}</span>
      </button>

      {showModal && (
        <div className="sos-modal-overlay">
          <div className="sos-modal-content">
            <div className="sos-header-modal">
                <div className="sos-modal-icon">🚨</div>
                <h3>Emergencia</h3>
            </div>
            
            <p className="sos-info-text">Contactando a tu enlace de confianza:</p>
            
            <div className="phone-display-box">
              <span className="phone-number">{contactPhone}</span>
            </div>

            <div className="sos-modal-actions-list">
              <button className="btn-whatsapp-action" onClick={handleWhatsApp}>
                💬 Enviar WhatsApp
              </button>

              <button className="btn-call-action" onClick={handleCall}>
                📞 Llamar Ahora
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