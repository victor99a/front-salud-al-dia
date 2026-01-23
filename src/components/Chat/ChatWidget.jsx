import React, { useState, useEffect, useRef } from 'react';
import { HeartPulse, X, Send, Stethoscope, Activity, Loader2 } from 'lucide-react';
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
      content: 'Hola. Soy el Dr. Chapatín, tu asistente médico virtual. ¿En qué puedo orientarte con tu salud hoy?' 
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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, tengo dificultades técnicas. Intenta más tarde.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <button 
        className={`chat-button ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir Asistente Médico Virtual"}
      >
        {isOpen ? <X size={28} /> : <HeartPulse size={32} />}
        {!isOpen && <span className="notification-dot"></span>}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-info">
              <div className="bot-avatar-container">
                <Stethoscope size={26} color="#fff" strokeWidth={2} />
              </div>
              <div>
                <p className="bot-name">Dr. Chapatín</p>
                <div className="online-indicator">
                  <Activity size={12} style={{ marginRight: 4 }} />
                  Asistente Médico IA
                </div>
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
              <div className="message ai loading-container">
                <Loader2 className="animate-spin" size={18} />
                <span>Analizando...</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <form className="chat-input-area" onSubmit={sendMessage}>
            <input 
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe tus síntomas..."
              disabled={loading}
              autoFocus
            />
            <button 
              className="send-button" 
              type="submit" 
              disabled={loading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;