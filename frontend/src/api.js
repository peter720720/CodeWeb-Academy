const DEFAULT_LOCAL_API = 'http://localhost:3500';

export const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (import.meta.env.MODE === 'production') {
    if (typeof window !== 'undefined' && window.location) {
      return window.location.origin;
    }
    return '';
  }

  return DEFAULT_LOCAL_API;
};
