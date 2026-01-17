import React, { useEffect, useState } from 'react';
import { Users, Activity, ShieldAlert } from 'lucide-react';
import { getStats } from '../../services/AdminService';

const AdminStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    patients: 0,
    active: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const data = await getStats();
      
      if (data && data.roles) {
        // Buscamos el conteo de administradores ignorando mayúsculas/minúsculas
        const adminCount = data.roles.find(r => 
          r.role?.toLowerCase() === 'admin'
        )?.count || 0;

        // Buscamos pacientes o usuarios normales ignorando mayúsculas/minúsculas
        const patientCount = data.roles.find(r => 
          r.role?.toLowerCase() === 'user' || 
          r.role?.toLowerCase() === 'patient'
        )?.count || 0;

        setStats({
          total: data.total || 0,
          active: data.active || 0,
          admins: adminCount,
          patients: patientCount
        });
      }
    };
    loadStats();
  }, []);

  return (
    <div className="stats-grid">
      <div className="health-card-admin">
        <div className="stat-icon icon-blue">
          <Users size={24} />
        </div>
        <div className="stat-info">
          <p className="stats-label">Total Usuarios</p>
          <span className="stats-value">{stats.total}</span>
        </div>
      </div>

      <div className="health-card-admin">
        <div className="stat-icon icon-orange">
          <Activity size={24} />
        </div>
        <div className="stat-info">
          <p className="stats-label">Usuarios Activos (30d)</p>
          <span className="stats-value">{stats.active}</span>
        </div>
      </div>

      <div className="health-card-admin">
        <div className="stat-icon icon-purple">
          <ShieldAlert size={24} />
        </div>
        <div className="stat-info-mixed">
          <div className="role-item">
            <div className="role-label-group">
              <span className="role-dot dot-patient"></span>
              <p className="stats-label">Pacientes</p>
            </div>
            <span className="mixed-value">{stats.patients}</span>
          </div>
          <div className="role-item">
            <div className="role-label-group">
              <span className="role-dot dot-admin"></span>
              <p className="stats-label">Admins</p>
            </div>
            <span className="mixed-value">{stats.admins}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;