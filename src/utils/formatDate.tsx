export function formatDate(value: string | null | undefined): string {
  if (!value) return "-"; 

  const date = new Date(value);
  if (isNaN(date.getTime())) return ""; 

  return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
  });
}
