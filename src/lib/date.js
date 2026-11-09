// export const MAX_DAYS = 7;

// const pad = (n) => String(n).padStart(2, "0");

// // Date -> "YYYY-MM-DD" in the user's local time
// export const toKey = (date) =>
//   `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// // "YYYY-MM-DD" -> local Date at midnight
// export const parseKey = (key) => {
//   const [y, m, d] = key.split("-").map(Number);
//   return new Date(y, m - 1, d);
// };

// export const todayKey = () => toKey(new Date());

// export const addDays = (key, n) => {
//   const date = parseKey(key);
//   date.setDate(date.getDate() + n);
//   return toKey(date);
// };

// const dayNumber = (key) => {
//   const [y, m, d] = key.split("-").map(Number);
//   return Date.UTC(y, m - 1, d) / 86400000;
// };

// // whole days from a to b
// export const diffDays = (a, b) => dayNumber(b) - dayNumber(a);

// export const formatShort = (key) =>
//   parseKey(key).toLocaleDateString("en-US", { month: "short", day: "numeric" });

// export const formatRange = (start, end) =>
//   start === end
//     ? formatShort(start)
//     : `${formatShort(start)} – ${formatShort(end)}`;

export const MAX_DAYS = 7;

const pad = (n) => String(n).padStart(2, "0");

// Date -> "YYYY-MM-DD" in the user's local time
export const toKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// "YYYY-MM-DD" -> local Date at midnight
export const parseKey = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const todayKey = () => toKey(new Date());

export const addDays = (key, n) => {
  const date = parseKey(key);
  date.setDate(date.getDate() + n);
  return toKey(date);
};

const dayNumber = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86400000;
};

// whole days from a to b
export const diffDays = (a, b) => dayNumber(b) - dayNumber(a);

export const formatShort = (key) =>
  parseKey(key).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const formatRange = (start, end) =>
  start === end
    ? formatShort(start)
    : `${formatShort(start)} – ${formatShort(end)}`;

// Delivery window = pick-up day + the day after.
// "before" = not open yet, "open" = buttons work, "closed" = window missed.
export const deliveryWindow = (startDate, today = todayKey()) => {
  if (today < startDate) return "before";
  if (today > addDays(startDate, 1)) return "closed";
  return "open";
};