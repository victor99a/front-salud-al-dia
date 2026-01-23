export function formatDateDownload(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const fecha = date.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const hora = date.getHours().toString().padStart(2, "0");
  const minutos = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() < 12 ? "am" : "pm";

  return `${fecha} · ${hora}:${minutos} ${ampm}`
    .replace(/^./, c => c.toUpperCase());
}
