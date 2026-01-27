import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, ArrowLeft, User, AlertTriangle, HeartPulse, ShieldCheck, Download, Activity, Droplets, CreditCard, Scale, Ruler, Heart as HeartIcon, FileWarning } from 'lucide-react';
import { 
    getMedicalRecord, 
    getPatientDashboardData, 
    getPatientHistory, 
    getDownloadUrl 
} from '../services/SpecialistService';
import { getUserProfile } from '../services/AuthService';
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
        
        const [record, dash, hist, profile] = await Promise.all([
            getMedicalRecord(userId),
            getPatientDashboardData(userId),
            getPatientHistory(userId),
            getUserProfile(userId, token)
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
  }, [userId]);

  const calculateIMC = (weight, height) => {
    if (!weight || !height || height === 0) return '-';
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  if (loading) return <div className="loading-screen">Verificando datos en la base de datos...</div>;

  return (
    <div className="file-bg">
      <div className="file-container">
        <header className="file-top-bar">
            <button className="btn-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} /> Volver al Panel
            </button>
            <div className="header-center-info">
                <h1>Ficha Clínica Digital</h1>
                <p className="patient-subtitle">Paciente: {userProfile ? `${userProfile.first_names} ${userProfile.last_names}` : userId}</p>
            </div>
            <div className="placeholder-side"></div>
        </header>

        <div className="file-grid">
            <aside className="patient-info-card">
                <div className="profile-avatar-large"><User size={40} /></div>
                <h3 className="card-title">Resumen Clínico</h3>
                
                <div className="info-group">
                    <label><User size={14}/> Nombre Completo</label>
                    <span className="value-text" style={{textTransform: 'capitalize'}}>
                        {userProfile ? `${userProfile.first_names} ${userProfile.last_names}` : 'No disponible'}
                    </span>
                </div>

                <div className="info-group">
                    <label><CreditCard size={14}/> RUT</label>
                    <span className="value-text">{userProfile?.rut || 'No disponible'}</span>
                </div>

                <div className="divider"></div>

                {!medicalRecord ? (
                  <div className="sos-section-embedded" style={{borderColor: '#e2e8f0', borderLeftColor: '#94a3b8', borderRightColor: '#94a3b8', background: '#f8fafc'}}>
                      <div className="sos-label" style={{color: '#64748b'}}>
                          <FileWarning size={14} /> Ficha Médica Inexistente
                      </div>
                      <p style={{fontSize: '0.85rem', color: '#64748b', margin: 0}}>
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
                        <p style={{fontSize: '0.9rem', color: '#334155', fontWeight: '700', margin: 0}}>
                          {medicalRecord.allergies || 'Ninguna'}
                        </p>
                    </div>

                    <div className="info-group">
                        <label><ShieldCheck size={14}/> Enf. Crónicas</label>
                        <p style={{fontSize: '0.9rem', color: '#334155', fontWeight: '700', margin: 0}}>
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
                            <strong style={{color: '#1e40af'}}>
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
                    <PressureCard 
                        systolic={dashboardData.pressure?.systolic || 0}
                        diastolic={dashboardData.pressure?.diastolic || 0}
                        date={dashboardData.pressure?.date ? new Date(dashboardData.pressure.date).toLocaleString() : 'Sin datos'}
                    />
                    <GlucoseCard 
                        glucose={dashboardData.glucose?.value || 0}
                        date={dashboardData.glucose?.date ? new Date(dashboardData.glucose.date).toLocaleString() : 'Sin datos'}
                    />
                </div>

                <div className="history-section-mini">
                    <div className="section-header">
                        <h3 style={{margin: 0, color: '#1e293b', fontWeight: 800}}>Historial de Controles</h3>
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
                                        <td>
                                            {(h.glucose > 140 || h.systolic >= 140) ? <span className="status-dot red">Alerta</span> : <span className="status-dot green">Normal</span>}
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