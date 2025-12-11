export default function formatDateForMySQL(date) {
  const d = date ? new Date(date) : new Date();
  return d.toISOString().slice(0, 19).replace("T", " ");
}
