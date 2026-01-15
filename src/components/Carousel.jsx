import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/carouselStyles.css';
import imagen1 from '../assets/imagen1.png'; // Asegúrate de tener estas imágenes
import carrusel1 from '../assets/carrusel-1.png';

const Carousel = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef();

  const slides = [
    {
      id: 1,
      badge: "Salud explicada por IA",
      title: "Monitorea tu Presión y Glucosa con IA",
      text: "Controla tus niveles de forma simple y segura.",
      img: carrusel1
    },
    {
      id: 2,
      badge: "Tecnología Gemini",
      title: "Análisis Clínico en Lenguaje Claro",
      text: "Entiende tus resultados sin tecnicismos complejos.",
      img: imagen1
    },
    {
      badge: "Vive tranquilo",
      title: "Tus Datos Médicos están Seguros",
      text: "Implementamos altos estándares de seguridad y cifrado para que tu información personal esté siempre protegida.",
      img: imagen2 
    }
  ];

  // Lógica para mover el scroll suavemente
  useEffect(() => {
    const listNode = listRef.current;
    const imgNode = listNode.querySelectorAll("li > img")[currentIndex];

    if (imgNode) {
      imgNode.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }, [currentIndex]);

  const scrollToImage = (direction) => {
    if (direction === 'prev') {
      setCurrentIndex(curr => (curr === 0 ? 0 : curr - 1));
    } else {
      setCurrentIndex(curr => (curr === slides.length - 1 ? curr : curr + 1));
    }
  };

  return (
    <div className="main-container">
      <div className="slider-container">
        {/* Flechas */}
        <div className="leftArrow" onClick={() => scrollToImage('prev')}>&#10094;</div>
        <div className="rightArrow" onClick={() => scrollToImage('next')}>&#10095;</div>
        
        <div className="container-images">
          <ul ref={listRef}>
            {slides.map((item, index) => (
              <li key={item.id} className="slide-item">
                <div className="hero-text">
                  <span className="badge">{item.badge}</span>
                  <h1>{item.title}</h1>
                  <p>{item.text}</p>
                  <button className="btn-primary big" onClick={() => navigate("/signup")}>
                    Comenzar Ahora
                  </button>
                </div>
                <img src={item.img} alt="Salud" />
              </li>
            ))}
          </ul>
        </div>

        {/* Puntos (Dots) */}
        <div className="dots-container">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`dot-item ${idx === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
            >
              &#9679;
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;