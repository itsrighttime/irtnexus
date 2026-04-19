export const isActive = (route?: string) => {
  if (!route) return false;

  const current = location.pathname.split("/").filter(Boolean);
  const target = route.split("/").filter(Boolean);

  return target.every((segment, index) => current[index + 1] === segment);
};