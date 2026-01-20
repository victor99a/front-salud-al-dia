export const formatRut = (rut) => {
  if (!rut) return "";
  const value = rut.replace(/[^0-9kK]/g, "");
  if (value.length <= 1) return value;
  
  const body = value.slice(0, -1);
  const dv = value.slice(-1).toUpperCase();
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  return `${formattedBody}-${dv}`;
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

