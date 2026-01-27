import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SosButton from './SosButton'; 
import '../Styles/NavbarStyles.css';
import logo1 from '../assets/logo1.png';
import { Stethoscope, LogOut, LayoutDashboard } from 'lucide-react';

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

    const isSpecialist = userRole === 'specialist';
    // El SOS se muestra solo si hay token, NO es admin y NO es especialista
    const showSos = token && !isUserAdmin && !isSpecialist;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Lógica del Logo: Especialista -> Panel, Otros -> Home */}
                <Link 
                    to={isSpecialist ? "/panel-medico" : "/"} 
                    className="nav-logo" 
                    onClick={() => setIsOpen(false)}
                >
                    <img src={logo1} alt="Salud al Día" className="logo-img" />
                </Link>

                <div className={`nav-collapse ${isOpen ? 'active' : ''}`}>
                    <div className="nav-menu">
                        <Link to="/about" className="nav-item" onClick={() => setIsOpen(false)}>Sobre Nosotros</Link>
                        <Link to="/contact" className="nav-item" onClick={() => setIsOpen(false)}>Contáctanos</Link>
                        
                        {token && (
                            <>
                                {isSpecialist ? (
                                    <Link to="/panel-medico" className="nav-item nav-special-link" onClick={() => setIsOpen(false)}>
                                        <LayoutDashboard size={18} className="nav-icon-inline" /> Panel Médico
                                    </Link>
                                ) : isUserAdmin ? (
                                    <Link to="/admin" className="nav-item" onClick={() => setIsOpen(false)}>Panel Admin</Link>
                                ) : (
                                    <>
                                        <Link to="/dashboard" className="nav-item" onClick={() => setIsOpen(false)}>Mi Panel</Link>
                                        <Link to="/historial" className="nav-item" onClick={() => setIsOpen(false)}>Historial</Link>
                                        <Link to="/perfil" className="nav-item" onClick={() => setIsOpen(false)}>Mi Perfil</Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div className="nav-auth">
                        {token ? (
                            <div className="nav-user-area">
                                {isSpecialist && (
                                    <div className="specialist-nav-badge">
                                        <div className="specialist-info">
                                            <span className="specialist-name">{docName}</span>
                                            <span className="specialist-role">Profesional</span>
                                        </div>
                                        <div className="specialist-icon-box">
                                            <Stethoscope size={18} />
                                        </div>
                                    </div>
                                )}

                                {showSos && <div className="sos-desktop-wrapper"><SosButton /></div>}
                                
                                <button onClick={handleLogout} className={isSpecialist ? "btn-logout-specialist" : "btn-login btn-logout-general"}>
                                    {isSpecialist ? (
                                        <>
                                            <LogOut size={16} /> Salir
                                        </>
                                    ) : (
                                        "Cerrar Sesión"
                                    )}
                                </button>
                            </div>
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