const DEFAULT_LOCAL_API = 'http://localhost:3500';
const DEFAULT_PROD_API = 'https://codeweb-academy.onrender.com';

export const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (import.meta.env.MODE === 'production') {
    return DEFAULT_PROD_API;
  }

  return DEFAULT_LOCAL_API;
};
