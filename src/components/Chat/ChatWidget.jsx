import React, { useState, useEffect, useRef } from 'react';
import '../../Styles/ChatWidgetStyles.css';

const ChatWidget = ({ userId }) => {
  if (!userId) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const API_URL = import.meta.env.VITE_AI_MS_URL || 'http://localhost:3002';

  useEffect(() => {
    setMessages([{ 
      role: 'assistant', 
      content: 'Hola. Soy el Dr. Chapatin, tu asistente de salud. ¿En qué puedo ayudarte hoy?' 
    }]);
    setIsOpen(false);
  }, [userId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const currentInput = input;
    setMessages(prev => [...prev, { role: 'user', content: currentInput }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/ai/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: currentInput }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error de conexión con el servicio de salud.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <button 
        className={`chat-button ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir asistente"
      >
        {isOpen ? '✕' : '🩺'}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-info">
              <span className="bot-avatar">👨‍⚕️</span>
              <div>
                <p className="bot-name">Dr. Chapatin</p>
                <span className="online-indicator">En línea</span>
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role === 'user' ? 'user' : 'ai'}`}>
                {m.content}
              </div>
            ))}
            
            {loading && (
              <div className="message ai loading-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <form className="chat-input-area" onSubmit={sendMessage}>
            <input 
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={loading ? "Procesando..." : "Escribe tu consulta aquí..."}
              disabled={loading}
              autoFocus
            />
            <button 
              className="send-button" 
              type="submit" 
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;