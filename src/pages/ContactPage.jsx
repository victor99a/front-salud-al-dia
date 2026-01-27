import React, { useState } from 'react';
import '../Styles/ContactStyles.css';

const ContactPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
        question: "¿Cómo registro mi presión arterial o glucosa?",
        answer: "Ve a tu 'Mi Panel' y busca la tarjeta de 'Registro Rápido'. Selecciona si quieres guardar Glucosa o Presión, ingresa el valor y pulsa Guardar. ¡Se añadirá automáticamente a tu historial!"
      },
      {
        question: "¿Puedo ver mis datos en otro celular?",
        answer: "¡Sí! Como Salud al Día guarda tu información en la nube de forma segura, solo necesitas iniciar sesión con tu correo y contraseña en cualquier dispositivo para ver todo tu historial."
      },
      {
        question: "¿Es seguro guardar mi información médica aquí?",
        answer: "Absolutamente. Utilizamos encriptación y estándares de seguridad para proteger tu privacidad. Nadie más tiene acceso a tus datos personales sin tu autorización."
      },
      {
        question: "¿Qué hago si me equivoqué al anotar un dato?",
        answer: "No te preocupes. Ve a la sección 'Historial', busca el registro incorrecto y verás una opción para eliminarlo. Luego puedes volver a ingresarlo correctamente."
      },
      {
        question: "¿Cómo puedo recuperar mi contraseña?",
        answer: "En la pantalla de Iniciar Sesión, pulsa sobre '¿Olvidaste tu contraseña?'. Te enviaremos un enlace a tu correo registrado para que puedas crear una nueva."
      }
  ];

  return (
    <div className="contact-container">
      <div className="contact-hero">
        <h1>Centro de Ayuda</h1>
        <p>Estamos aquí para escucharte y resolver tus dudas.</p>
      </div>

      <div className="contact-grid-equal">
        <div className="contact-card-equal">
          <h2> Reportar un Problema</h2>
          <p className="report-description">
            ¿Encontraste un error en la web? Cuéntanos para arreglarlo.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); alert('¡Gracias! Mensaje enviado al equipo técnico.'); }}>
            <div className="form-group">
              <label>Asunto</label>
              <input type="text" className="form-input" placeholder="Ej: Error al guardar datos" required />
            </div>
            <div className="form-group">
              <label>Mensaje</label>
              <textarea className="form-textarea" rows="5" placeholder="Describe el problema..." required></textarea>
            </div>
            <button type="submit" className="btn-send">Enviar Reporte</button>
          </form>
        </div>

        <div className="contact-card-equal delete-card-style">
            <div className="delete-content-centered">
                <h3> Gestión de Cuenta</h3>
                <p>
                Lamentamos que quieras irte. Si deseas <strong>eliminar tu cuenta</strong> y borrar 
                todos tus datos permanentemente de nuestros servidores, por favor escribe desde 
                tu correo registrado a:
                </p>
                <br />
                <a href="mailto:bajas@saludaldia.com?subject=Solicitud de Baja de Cuenta" className="email-link-large">
                 bajas@saludaldia.com
                </a>
                <p className="delete-warning">
                *El proceso es irreversible y puede tardar hasta 48 horas hábiles.
                </p>
            </div>
        </div>
      </div>

      <div className="faq-section">
        <h2 className="faq-title">Preguntas Frecuentes (FAQ)</h2>
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div className="faq-item" key={index}>
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                {item.question}
                <span>{activeIndex === index ? '−' : '+'}</span>
              </button>
              <div className={`faq-answer ${activeIndex === index ? 'open' : ''}`}>
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;