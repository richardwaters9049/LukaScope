const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Europe/London",
});

export function formatDisplayDate(value: string) {
  return dateFormatter.format(new Date(value));
}
