import React, { useState } from "react";
import axios from 'axios';
import { AlertTriangle, Phone, MessageCircle, X, Copy, Check, Siren } from "lucide-react";
import "../Styles/SosButtonStyles.css";

const SosButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [contactPhone, setContactPhone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const USER_ID = localStorage.getItem("user_id");

  const handleSOSClick = async () => {
    if (!USER_ID) {
      alert("Error: Debe iniciar sesión para utilizar el servicio de emergencia.");
      return;
    }

    setLoading(true);
    try {
      const API_SOS_URL = import.meta.env.VITE_API_SOS_URL || "http://localhost:3000";

      const response = await axios.get(
        `${API_SOS_URL}/api/sos/emergency-contact/${USER_ID}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );

      const data = response.data;

      if (data.success && data.phone) {
        setContactPhone(data.phone);
        setShowModal(true);
        setCopied(false);
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
      const message = encodeURIComponent("¡EMERGENCIA! Necesito ayuda urgente.");
      window.open(`https://wa.me/${cleanNum}?text=${message}`, "_blank");
    }
  };

  const handleCopyNumber = () => {
    if (contactPhone) {
      navigator.clipboard.writeText(contactPhone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
        <Siren size={20} />
        <span>{loading ? "..." : "SOS"}</span>
      </button>

      {showModal && (
        <div className="sos-modal-overlay">
          <div className="sos-modal-content">
            
            <button 
                className="sos-modal-close-icon"
                onClick={() => setShowModal(false)}
            >
                <X size={24} />
            </button>

            <div className="sos-modal-header-icon">
                <AlertTriangle size={48} color="#dc2626" />
            </div>
            
            <h3>Ayuda de Emergencia</h3>
            <p className="sos-info-text">
              Selecciona una opción para contactar a tu enlace de confianza:
            </p>

            <div 
                className="phone-display-box" 
                onClick={handleCopyNumber}
                title="Haz clic para copiar"
            >
              <span className="phone-number">{contactPhone}</span>
              <div className="copy-indicator">
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copiado" : "Copiar"}</span>
              </div>
            </div>

            <div className="sos-modal-actions-list">
              <button className="btn-whatsapp-action" onClick={handleWhatsApp}>
                <MessageCircle size={20} />
                Enviar WhatsApp
              </button>

              <button className="btn-call-action" onClick={handleCall}>
                <Phone size={20} />
                Llamar por Teléfono
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