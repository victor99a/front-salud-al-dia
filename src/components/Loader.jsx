import React from 'react';
import { Loader2 } from 'lucide-react';
import '../Styles/LoaderStyles.css';

const Loader = ({ message = "Cargando sistema..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <Loader2 className="loader-spinner" size={60} />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Loader;