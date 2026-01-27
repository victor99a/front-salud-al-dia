import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Phone, 
    ArrowLeft, 
    User, 
    AlertTriangle, 
    HeartPulse, 
    ShieldCheck, 
    Download, 
    Activity, 
    Droplets, 
    CreditCard, 
    Scale, 
    Ruler, 
    Heart as HeartIcon, 
    FileWarning 
} from 'lucide-react';
import { 
    getMedicalRecord, 
    getPatientDashboardData, 
    getPatientHistory, 
    getDownloadUrl,
    getPatientById 
} from '../services/SpecialistService';
import GlucoseCard from '../components/Dashboard/GlucoseCard';
import PressureCard from '../components/Dashboard/PressureCard';
import '../Styles/SpecialistStyles.css';

const PatientFile = () => {
  const { id: userId } = useParams(); 
  const navigate = useNavigate();
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState({ glucose: null, pressure: null });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        const [record, dash, hist, profile] = await Promise.all([
            getMedicalRecord(userId),
            getPatientDashboardData(userId),
            getPatientHistory(userId),
            getPatientById(userId)
        ]);

        setMedicalRecord(record);
        setDashboardData(dash);
        setHistory(hist);
        setUserProfile(profile);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) loadData();
  }, [userId, navigate]);

  const calculateIMC = (weight, height) => {
    if (!weight || !height || height === 0) return '-';
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const renderStatusBadges = (record) => {
    const alerts = [];

    if (record.glucose) {
        if (record.glucose > 140) {
            alerts.push({ text: 'Glucosa Alta', className: 'badge-warning' });
        } else if (record.glucose < 70) {
            alerts.push({ text: 'Hipoglucemia', className: 'badge-danger' });
        }
    }

    if (record.systolic && record.diastolic) {
        if (record.systolic >= 140 || record.diastolic >= 90) {
            alerts.push({ text: 'Hipertensión', className: 'badge-danger' });
        } else if (record.systolic >= 130 || record.diastolic >= 85) {
            alerts.push({ text: 'Presión Elevada', className: 'badge-warning' });
        }
    }

    if (alerts.length === 0) {
        return <span className="status-dot green">Estable</span>;
    }

    return (
        <div className="badges-container">
            {alerts.map((alert, index) => (
                <span key={index} className={`status-badge-mini ${alert.className}`}>
                    {alert.text}
                </span>
            ))}
        </div>
    );
  };

  if (loading) return <div className="loading-screen">Cargando información clínica del paciente...</div>;

  return (
    <div className="file-bg">
      <div className="file-container">
        <header className="file-top-bar">
            <button className="btn-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} /> Volver al Panel
            </button>
            <div className="header-center-info">
                <h1>Ficha Clínica Digital</h1>
                <p className="patient-subtitle">
                    Paciente: {userProfile ? `${userProfile.first_names} ${userProfile.last_names}` : userId}
                </p>
            </div>
            <div className="placeholder-side"></div>
        </header>

        <div className="file-grid">
            <aside className="patient-info-card">
                <div className="profile-avatar-large"><User size={40} /></div>
                <h3 className="card-title">Resumen Clínico</h3>
                
                <div className="info-group">
                    <label><User size={14}/> Nombre Completo</label>
                    <span className="value-text capitalize-text">
                        {userProfile ? `${userProfile.first_names} ${userProfile.last_names}` : 'No disponible'}
                    </span>
                </div>

                <div className="info-group">
                    <label><CreditCard size={14}/> RUT</label>
                    <span className="value-text">{userProfile?.rut || 'No disponible'}</span>
                </div>

                <div className="divider"></div>

                {!medicalRecord ? (
                  <div className="sos-section-embedded no-record">
                      <div className="sos-label gray">
                          <FileWarning size={14} /> Ficha Médica Inexistente
                      </div>
                      <p className="no-record-text">
                          Este usuario no ha completado su registro inicial de salud.
                      </p>
                  </div>
                ) : (
                  <>
                    <div className="info-group">
                        <label><HeartPulse size={14}/> Sangre</label>
                        <span className="badge-blood">{medicalRecord.blood_type || '---'}</span>
                    </div>
                    
                    <div className="info-group">
                        <label className="alert-label"><AlertTriangle size={14}/> Alergias</label>
                        <p className="condition-text">
                          {medicalRecord.allergies || 'Ninguna'}
                        </p>
                    </div>

                    <div className="info-group">
                        <label><ShieldCheck size={14}/> Enf. Crónicas</label>
                        <p className="condition-text">
                          {medicalRecord.chronic_diseases || 'Ninguna'}
                        </p>
                    </div>

                    <div className="divider"></div>

                    <div className="physical-data">
                        <div className="phy-item">
                            <small><Scale size={14}/> Peso</small>
                            <strong>{medicalRecord.initial_weight || '---'} kg</strong>
                        </div>
                        <div className="phy-item">
                            <small><Ruler size={14}/> Altura</small>
                            <strong>{medicalRecord.height || '---'} cm</strong>
                        </div>
                        <div className="phy-item">
                            <small><HeartIcon size={14}/> IMC</small>
                            <strong className="imc-value">
                                {calculateIMC(medicalRecord.initial_weight, medicalRecord.height)}
                            </strong>
                        </div>
                    </div>

                    <div className="sos-section-embedded">
                        <div className="sos-label">
                            <Phone size={14} /> Contacto Emergencia
                        </div>
                        <div className="sos-data-row">
                            <strong>Nombre:</strong>
                            <span>{medicalRecord.emergency_contact_name || 'No registrado'}</span>
                        </div>
                        <div className="sos-data-row">
                            <strong>Número:</strong>
                            <span className="sos-phone-black">{medicalRecord.emergency_contact_phone || '---'}</span>
                        </div>
                    </div>
                  </>
                )}
            </aside>

            <section className="vitals-section">
                <div className="vitals-cards-grid">
                    <GlucoseCard 
                        glucose={dashboardData.glucose?.value || 0}
                        date={dashboardData.glucose?.date}
                    />
                    <PressureCard 
                        systolic={dashboardData.pressure?.systolic || 0}
                        diastolic={dashboardData.pressure?.diastolic || 0}
                        date={dashboardData.pressure?.date} 
                    />
                </div>

                <div className="history-section-mini">
                    <div className="section-header">
                        <h3>Historial de Controles</h3>
                        <button className="btn-download" onClick={() => window.open(getDownloadUrl(userId), '_blank')}>
                            <Download size={16} /> Exportar PDF
                        </button>
                    </div>
                    <div className="mini-table-container">
                        <table className="mini-table">
                            <thead>
                                <tr>
                                    <th>FECHA</th>
                                    <th><Droplets size={14}/> GLUCOSA</th>
                                    <th><Activity size={14}/> PRESION</th>
                                    <th>ESTADO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length > 0 ? history.map((h, i) => (
                                    <tr key={i}>
                                        <td>{new Date(h.date).toLocaleDateString()}</td>
                                        <td>
                                            {h.glucose ? <span className={`value-box ${h.glucose > 140 ? 'val-high' : h.glucose < 70 ? 'val-low' : 'val-normal'}`}>{h.glucose} mg/dL</span> : '--'}
                                        </td>
                                        <td>
                                            {h.systolic ? <span className={`value-box ${h.systolic >= 140 || h.diastolic >= 90 ? 'val-high' : 'val-normal'}`}>{h.systolic}/{h.diastolic} mmHg</span> : '--'}
                                        </td>
                                        <td className="status-cell">
                                            {renderStatusBadges(h)}
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="4" className="no-data">Sin registros históricos</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default PatientFile;