import React, { useState } from "react";
import "../Styles/SosButtonStyles.css";

const SosButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [contactPhone, setContactPhone] = useState(null);
  const [loading, setLoading] = useState(false);

  const USER_ID = localStorage.getItem("user_id");

  const handleSOSClick = async () => {
    if (!USER_ID) {
      alert("Error: Debe iniciar sesión para utilizar el servicio de emergencia.");
      return;
    }

    setLoading(true);
    try {
      const API_SOS_URL = import.meta.env.VITE_API_SOS_URL || "http://localhost:3000";

      const response = await fetch(
        `${API_SOS_URL}/api/sos/emergency-contact/${USER_ID}`
      );
      
      if (!response.ok) throw new Error("Error en la petición al servidor");

      const data = await response.json();

      if (data.success && data.phone) {
        setContactPhone(data.phone);
        setShowModal(true);
      } else {
        alert(data.message || "No se encontró un contacto de emergencia asociado.");
      }
    } catch (err) {
      console.error("Error conectando al servicio SOS:", err);
      alert("Error de conexión: No se pudo contactar con el servicio de emergencia.");
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (contactPhone) window.location.href = `tel:${contactPhone}`;
  };

  const handleWhatsApp = () => {
    if (contactPhone) {
      const cleanNum = contactPhone.replace(/\D/g, '');
      const message = encodeURIComponent("🚨 ¡EMERGENCIA! Necesito ayuda urgente.");
      
      window.open(`https://wa.me/${cleanNum}?text=${message}`, "_blank");
    }
  };

  return (
    <>
      <button
        className={`sos-button-final ${loading ? 'loading' : ''}`}
        onClick={handleSOSClick}
        disabled={loading}
        aria-label="Emergencia SOS"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18.6 2.5a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2V4.5a2 2 0 0 1 2-2h13.2zM12 18h.01M12 21v1" /> 
        </svg>
        <span>{loading ? "..." : "SOS"}</span>
      </button>

      {showModal && (
        <div className="sos-modal-overlay">
          <div className="sos-modal-content">
            <div className="sos-modal-icon">🚨</div>
            <h3>Ayuda de Emergencia</h3>
            <p className="sos-info-text">
              Selecciona una opción para contactar a tu enlace de confianza:
            </p>

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

              <button
                className="btn-cancel-action"
                onClick={() => setShowModal(false)}
              >
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