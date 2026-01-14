import HealthRegisterForm from "../components/Dashboard/HealthRegisterForm";
import "../Styles/healthRegister.css";

export default function HealthRegisterPage() {
  return (
    <div className="health-page">
      <h1>Registrar Información de Salud</h1>
      <p>Ingresa tus valores de glucosa y presión arterial</p>
      <HealthRegisterForm />
    </div>
  );
}
