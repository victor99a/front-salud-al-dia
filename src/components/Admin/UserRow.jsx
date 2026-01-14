import React from 'react';
import { Key, Trash2 } from 'lucide-react';
import { resetUserPassword, deleteUser } from '../../services/AdminService';

const UserRow = ({ user, onUpdate }) => {
  if (!user) return null;

  const handleReset = async () => {
    if (!user.email) return alert("Este usuario no tiene correo registrado.");
    
    const confirmed = window.confirm(`¿Enviar enlace de recuperación a ${user.email}?`);
    if (confirmed) {
      const { success, error } = await resetUserPassword(user.email);
      if (success) alert("Correo de recuperación enviado con éxito.");
      else alert("Error: " + error);
    }
  };

  const handleDelete = async () => {
    const isDeletionRequested = user.status === 'delete_requested';
    const message = isDeletionRequested
      ? `ATENCIÓN: El paciente ha solicitado ELIMINAR sus datos. ¿Confirmas la eliminación definitiva de ${user.first_names}?`
      : `¿Estás seguro de que deseas eliminar a ${user.first_names}? Esta acción es irreversible.`;

    if (window.confirm(message)) {
      const { success, error } = await deleteUser(user.id);
      if (success) {
        alert("Usuario eliminado correctamente.");
        if (onUpdate) onUpdate(); 
      } else {
        alert("Error al eliminar: " + error);
      }
    }
  };

  return (
    <tr className="admin-row">
      <td>{user.rut || '---'}</td>

      <td className="user-name">
        {user.first_names} {user.last_names}
        {user.status === 'delete_requested' && user.delete_requested_at && (
          <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '4px', fontWeight: 'normal' }}>
            📅 Solicitó borrar: {new Date(user.delete_requested_at).toLocaleDateString()}
          </div>
        )}
      </td>

      <td>{user.email}</td>

      <td>
        <span className={`status-badge ${user.role === 'admin' ? 'status-admin' : 'status-user'}`}>
          {user.role || 'user'}
        </span>
      </td>

      <td>
        <span className={`status-badge status-${user.status || 'active'}`}>
          {user.status === 'delete_requested' ? '⚠️ Por Borrar' : 'Activo'}
        </span>
      </td>

      <td>
        <div className="actions-container">
          <button 
            onClick={handleReset} 
            className="btn-icon btn-key" 
            title="Reset Password"
          >
            <Key size={18} />
          </button>
          
          <button 
            onClick={handleDelete} 
            className={`btn-icon btn-trash ${user.status === 'delete_requested' ? 'btn-trash-urgent' : ''}`}
            title="Eliminar permanentemente"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;