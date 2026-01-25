import React, { useState } from 'react';
import { X, UserPlus, Mail, Lock, FileText } from 'lucide-react';
import { createSpecialist } from '../../services/AdminService';

const RegisterSpecialistModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        first_names: '',
        last_names: '',
        rut: '',
        email: '',
        password: ''
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const formatRut = (rut) => {
        let value = rut.replace(/[^0-9kK]/g, '');
        if (value.length <= 1) return value;
        const body = value.slice(0, -1);
        const dv = value.slice(-1).toUpperCase();
        return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${dv}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'rut') {
            setFormData({ ...formData, [name]: formatRut(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.rut || formData.rut.length < 8) newErrors.rut = "El RUT es incompleto.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) newErrors.email = "Formato de correo inválido.";
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        if (!passRegex.test(formData.password)) newErrors.password = "Mín. 6 caracteres, 1 mayús, 1 num, 1 símbolo.";
        if (!formData.first_names.trim()) newErrors.first_names = "Requerido.";
        if (!formData.last_names.trim()) newErrors.last_names = "Requerido.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        
        const { success, error } = await createSpecialist(formData);

        setLoading(false);

        if (success) {
            alert("Especialista creado con éxito.");
            onSuccess();
            onClose();
        } else {
            const errorText = error.toLowerCase();
            const serverErrors = {};

            if (errorText.includes('rut')) {
                serverErrors.rut = error;
            } else if (errorText.includes('correo') || errorText.includes('email')) {
                serverErrors.email = error;
            } else {
                alert("Error del sistema: " + error);
            }

            setErrors({ ...errors, ...serverErrors });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>
                        <UserPlus size={24} /> Registrar Especialista
                    </h3>
                    <button onClick={onClose} className="btn-close-modal">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid-2">
                        <div className="input-group-reset">
                            <label>Nombres</label>
                            <input 
                                type="text" 
                                name="first_names" 
                                value={formData.first_names} 
                                onChange={handleChange} 
                                className={`input-reset ${errors.first_names ? 'input-error-border' : ''}`} 
                            />
                            {errors.first_names && <span className="error-msg">{errors.first_names}</span>}
                        </div>
                        <div className="input-group-reset">
                            <label>Apellidos</label>
                            <input 
                                type="text" 
                                name="last_names" 
                                value={formData.last_names} 
                                onChange={handleChange} 
                                className={`input-reset ${errors.last_names ? 'input-error-border' : ''}`} 
                            />
                            {errors.last_names && <span className="error-msg">{errors.last_names}</span>}
                        </div>
                    </div>

                    <div className="input-group-reset">
                        <label>RUT</label>
                        <div className="input-icon-wrapper">
                            <FileText size={18} className="input-icon" />
                            <input 
                                type="text" 
                                name="rut" 
                                placeholder="12.345.678-K" 
                                value={formData.rut} 
                                onChange={handleChange} 
                                maxLength={12} 
                                className={`input-reset input-with-icon ${errors.rut ? 'input-error-border' : ''}`} 
                            />
                        </div>
                        {errors.rut && <span className="error-msg">{errors.rut}</span>}
                    </div>

                    <div className="input-group-reset">
                        <label>Correo Institucional</label>
                        <div className="input-icon-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                className={`input-reset input-with-icon ${errors.email ? 'input-error-border' : ''}`} 
                            />
                        </div>
                        {errors.email && <span className="error-msg">{errors.email}</span>}
                    </div>

                    <div className="input-group-reset">
                        <label>Contraseña Inicial</label>
                        <div className="input-icon-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                className={`input-reset input-with-icon ${errors.password ? 'input-error-border' : ''}`} 
                            />
                        </div>
                        {errors.password && <span className="error-msg">{errors.password}</span>}
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                        <button type="submit" className="btn-confirm" disabled={loading}>
                            {loading ? 'Validando...' : 'Registrar Profesional'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterSpecialistModal;