const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "2026-10" → "oct 2026" */
export function monthYear(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** Split prose on `backticks`: odd parts are code. */
export function codeParts(text: string) {
  return text.split("`").map((t, i) => ({ t, code: i % 2 === 1 }));
}
