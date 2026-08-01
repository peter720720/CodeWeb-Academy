export const getApiBase = () => {
  return import.meta.env.VITE_API_URL || '';
};
