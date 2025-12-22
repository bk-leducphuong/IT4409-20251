export const daysAgo = (days) => new Date(Date.now() - days * 864e5).toISOString();
export const monthsAgo = (months) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString();
};
export const yearsAgo = (years) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString();
};
