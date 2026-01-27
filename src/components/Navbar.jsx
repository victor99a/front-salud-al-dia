import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SosButton from './SosButton'; 
import '../Styles/NavbarStyles.css';
import logo1 from '../assets/logo1.png';
import { Stethoscope, LogOut } from 'lucide-react';

const Navbar = ({ isUserAdmin, userRole }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    
    const docName = localStorage.getItem('user_name') || '';
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.clear();
        window.dispatchEvent(new Event("auth-change"));
        navigate('/login');
        setIsOpen(false);
    };

    if (userRole === 'specialist') {
        return (
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="nav-logo">
                        <img src={logo1} alt="Salud al Día" className="logo-img" />
                    </div>
                    <div className="nav-specialist-controls">
                        <div className="specialist-info">
                            <span className="specialist-name">
                                {docName || 'Especialista'}
                            </span>
                            <span className="specialist-role">Profesional de Salud</span>
                        </div>
                        <div className="specialist-icon-box">
                            <Stethoscope size={20} />
                        </div>
                        <button 
                            onClick={handleLogout} 
                            className="btn-logout-specialist"
                        >
                            <LogOut size={16} /> Salir
                        </button>
                    </div>
                </div>
            </nav>
        );
    }

    const showSos = token && !isUserAdmin;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
                    <img src={logo1} alt="Salud al Día" className="logo-img" />
                </Link>

                <div className={`nav-collapse ${isOpen ? 'active' : ''}`}>
                    <div className="nav-menu">
                        <Link to="/about" className="nav-item" onClick={() => setIsOpen(false)}>Sobre Nosotros</Link>
                        <Link to="/contact" className="nav-item" onClick={() => setIsOpen(false)}>Contáctanos</Link>
                        {token && (
                            <>
                                {!isUserAdmin ? (
                                    <>
                                        <Link to="/dashboard" className="nav-item" onClick={() => setIsOpen(false)}>Mi Panel</Link>
                                        <Link to="/historial" className="nav-item" onClick={() => setIsOpen(false)}>Historial</Link>
                                        <Link to="/perfil" className="nav-item" onClick={() => setIsOpen(false)}>Mi Perfil</Link>
                                    </>
                                ) : (
                                    <Link to="/admin" className="nav-item" onClick={() => setIsOpen(false)}>Panel Admin</Link>
                                )}
                            </>
                        )}
                    </div>

                    <div className="nav-auth">
                        {token ? (
                            <>
                                {showSos && <div className="sos-desktop-wrapper"><SosButton /></div>}
                                <button onClick={handleLogout} className="btn-login">Cerrar Sesión</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-login" onClick={() => setIsOpen(false)}>Iniciar Sesión</Link>
                                <Link to="/signup" className="btn-register" onClick={() => setIsOpen(false)}>Registrarse</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="nav-mobile-actions">
                    {showSos && <div className="sos-mobile-wrapper"><SosButton /></div>}
                    <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;