export const isValidDate = (dateStr?: string) => {
  if (!dateStr) return true;
  const pattern = /^\d{2}-\d{2}-\d{4}$/;

  if (!pattern.test(dateStr)) return false;

  const [dd, mm, yyyy] = dateStr.split("-").map(Number);

  return (
    yyyy >= 1000 &&
    yyyy <= 9999 &&
    mm >= 1 &&
    mm <= 12 &&
    dd >= 1 &&
    dd <= new Date(yyyy, mm, 0).getDate()
  );
};

export const toDate = (str: string) => {
  const [dd, mm, yyyy] = str.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
};
