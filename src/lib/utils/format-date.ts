import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return format(parseISO(dateStr), "MMM d, yyyy");
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return format(parseISO(dateStr), "MMM d, yyyy h:mm a");
}

export function formatRelative(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}
