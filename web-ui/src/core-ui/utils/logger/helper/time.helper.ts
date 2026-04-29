export const getTime = (): string => {
  const now: Date = new Date();
  return now.toLocaleTimeString("en-GB", { hour12: false }); // HH:mm:ss
};
