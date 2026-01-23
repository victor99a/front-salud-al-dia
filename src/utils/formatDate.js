export function formatDateLong(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const fecha = date.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const hora24 = date.getHours().toString().padStart(2, "0");
  const minutos = date.getMinutes().toString().padStart(2, "0");

  const ampm = date.getHours() < 12 ? "am" : "pm";

  return `${fecha} · ${hora24}:${minutos} ${ampm}`
    .replace(/^./, c => c.toUpperCase());
}
