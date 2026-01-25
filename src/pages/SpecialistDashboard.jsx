import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, User } from 'lucide-react';
import { getPatients, getPatientDashboardData } from '../services/SpecialistService'; 
import '../Styles/SpecialistStyles.css'; 

const SpecialistDashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientsAndData = async () => {
      setLoading(true);
      try {
        const patientsList = await getPatients();
        
        const enrichedPatients = await Promise.all(
          patientsList.map(async (patient) => {
            try {
              const healthData = await getPatientDashboardData(patient.id);
              
              const lastGlucoseDate = healthData.glucose?.date ? new Date(healthData.glucose.date) : null;
              const lastPressureDate = healthData.pressure?.date ? new Date(healthData.pressure.date) : null;
              
              let lastControlDate = "Sin registros";
              if (lastGlucoseDate || lastPressureDate) {
                const dates = [lastGlucoseDate, lastPressureDate].filter(d => d !== null);
                const mostRecent = new Date(Math.max(...dates));
                lastControlDate = mostRecent.toLocaleDateString();
              }

              let status = 'stable';
              let statusLabel = 'Estable';

              const glucose = healthData.glucose?.value;
              const sys = healthData.pressure?.systolic;
              const dia = healthData.pressure?.diastolic;

              if (glucose > 140 || sys >= 140 || dia >= 90) {
                status = 'critical';
                statusLabel = 'Alerta';
              } else if (glucose > 0 && glucose < 70) {
                status = 'critical';
                statusLabel = 'Hipoglicemia';
              }

              return {
                ...patient,
                lastControl: lastControlDate,
                status: status,
                statusLabel: statusLabel
              };
            } catch (err) {
              return {
                ...patient,
                lastControl: 'Error de carga',
                status: 'stable',
                statusLabel: 'Estable'
              };
            }
          })
        );

        setPatients(enrichedPatients);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsAndData();
  }, []);

  const filteredPatients = patients.filter(p => {
    const fullName = `${p.first_names || ''} ${p.last_names || ''}`.toLowerCase();
    const rut = p.rut ? p.rut.toLowerCase() : '';
    const search = searchTerm.toLowerCase();
    const matchesSearch = fullName.includes(search) || rut.includes(search);
    
    if (!matchesSearch) return false;
    if (filter === 'all') return true;
    return p.status === filter;
  });

  return (
    <div className="specialist-bg">
      <div className="specialist-container">
        <header className="dashboard-header">
            <div className="header-title-wrapper">
                <h1>Panel de Control Medico</h1>
                <span className="badge-pro">Profesional</span>
            </div>
            <p>Monitoreo de pacientes en tiempo real</p>
        </header>

        <div className="toolbar-card">
            <div className="search-bar">
                <Search className="search-icon-input" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar paciente por RUT o Nombre..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="filter-buttons">
                <button 
                    className={`filter-btn ${filter === 'all' ? 'active blue' : ''}`} 
                    onClick={() => setFilter('all')}
                >
                    Todos
                </button>
                <button 
                    className={`filter-btn ${filter === 'critical' ? 'active red' : ''}`} 
                    onClick={() => setFilter('critical')}
                >
                    Alertas
                </button>
                <button 
                    className={`filter-btn ${filter === 'stable' ? 'active green' : ''}`} 
                    onClick={() => setFilter('stable')}
                >
                    Estables
                </button>
            </div>
        </div>

        <div className="table-container-medical">
            <div className="table-wrapper-scroll">
                <table className="medical-table">
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>RUT</th>
                            <th>Ultimo Control</th>
                            <th>Estado</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && filteredPatients.map(patient => (
                            <tr key={patient.id}>
                                <td className="patient-cell">
                                    <div className="avatar-circle">
                                        <User size={18} color="white" />
                                    </div>
                                    <div className="patient-info">
                                        <span className="patient-name">{patient.first_names} {patient.last_names}</span>
                                    </div>
                                </td>
                                <td>{patient.rut}</td>
                                <td>{patient.lastControl}</td>
                                <td>
                                    <span className={`status-badge-medical ${patient.status}`}>
                                        {patient.statusLabel}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        className="btn-view-file"
                                        onClick={() => navigate(`/paciente/${patient.id}`)}
                                    >
                                        <FileText size={16} /> Ver Ficha
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredPatients.length === 0 && !loading && (
                <div className="no-data">No se encontraron pacientes.</div>
            )}
            {loading && <div className="no-data">Cargando informacion de salud...</div>}
        </div>
      </div>
    </div>
  );
};

export default SpecialistDashboard;