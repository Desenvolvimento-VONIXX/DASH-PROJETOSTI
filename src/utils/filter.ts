import { Row } from "@tanstack/react-table";

export const betweenDates = <T>(
  row: Row<T>, // Aceita qualquer tipo genérico
  columnId: string,
  filterValue: [string | null, string | null] | undefined
): boolean => {
  const rowValue = new Date(row.getValue(columnId));
  const [start, end] = filterValue || [];
  const startDate = start
    ? new Date(new Date(start).setUTCHours(0, 0, 0, 0))
    : null;
  const endDate = end
    ? new Date(new Date(end).setUTCHours(23, 59, 59, 999))
    : null;

  if (startDate && rowValue < startDate) return false;
  if (endDate && rowValue > endDate) return false;

  return true;
};
