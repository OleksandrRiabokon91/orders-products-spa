export default function formatDateForMySQL(date) {
  if (!date) return new Date().toISOString().slice(0, 19).replace("T", " ");
  return new Date(date).toISOString().slice(0, 19).replace("T", " ");
}
