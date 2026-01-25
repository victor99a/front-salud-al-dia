import React, { useEffect, useState } from 'react';
import { Users, Activity, PieChart } from 'lucide-react';
import { getStats } from '../../services/AdminService';

const AdminStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    patients: 0,
    specialists: 0,
    active: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const data = await getStats();
      
      if (data && data.roles) {
        const adminCount = data.roles.find(r => r.role?.toLowerCase() === 'admin')?.count || 0;
        const specialistCount = data.roles.find(r => r.role?.toLowerCase() === 'specialist')?.count || 0;
        const patientCount = data.roles.find(r => 
          r.role?.toLowerCase() === 'user' || 
          r.role?.toLowerCase() === 'patient'
        )?.count || 0;

        setStats({
          total: data.total || 0,
          active: data.active || 0,
          admins: adminCount,
          patients: patientCount,
          specialists: specialistCount
        });
      }
    };
    loadStats();
  }, []);

  return (
    <div className="stats-grid">
      <div className="health-card-admin">
        <div className="stat-icon icon-blue">
          <Users size={28} />
        </div>
        <div className="stat-info">
          <p className="stats-label">Total Usuarios</p>
          <span className="stats-value">{stats.total}</span>
        </div>
      </div>

      <div className="health-card-admin">
        <div className="stat-icon icon-green">
          <Activity size={28} />
        </div>
        <div className="stat-info">
          <p className="stats-label">Activos (30d)</p>
          <span className="stats-value">{stats.active}</span>
        </div>
      </div>

      <div className="health-card-admin">
        <div className="stat-icon icon-purple">
          <PieChart size={28} />
        </div>
        
        <div className="stat-info-mixed">
          <div className="role-item">
            <div className="role-label-group">
              <span className="role-dot dot-patient"></span>
              <span className="mini-label">Pacientes</span>
            </div>
            <span className="mini-value">{stats.patients}</span>
          </div>

          <div className="role-item">
            <div className="role-label-group">
              <span className="role-dot dot-specialist"></span>
              <span className="mini-label">Especialistas</span>
            </div>
            <span className="mini-value">{stats.specialists}</span>
          </div>

          <div className="role-item">
            <div className="role-label-group">
              <span className="role-dot dot-admin"></span>
              <span className="mini-label">Admins</span>
            </div>
            <span className="mini-value">{stats.admins}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;