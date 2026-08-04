const DEFAULT_LOCAL_API = 'http://localhost:3500';
const DEFAULT_PROD_API = 'https://code-web-academy.onrender.com';

const buildApiCandidates = () => {
  const candidates = [];
  if (import.meta.env.VITE_API_URL) {
    candidates.push(import.meta.env.VITE_API_URL);
  }

  if (import.meta.env.MODE === 'production') {
    if (typeof window !== 'undefined' && window.location) {
      candidates.push(window.location.origin);
    }
    candidates.push(DEFAULT_PROD_API);
  } else {
    candidates.push(DEFAULT_LOCAL_API);
  }

  return candidates.filter(Boolean);
};

export const getApiBase = () => buildApiCandidates()[0] || '';

const normalizeUrl = (base, path) => {
  const cleanBase = base.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

export const fetchApi = async (path, options = {}) => {
  const candidateBases = buildApiCandidates();
  let lastError = null;
  let lastNon404Response = null;

  for (const base of candidateBases) {
    const url = normalizeUrl(base, path);
    try {
      const res = await fetch(url, options);
      const contentType = res.headers.get('content-type') || '';

      if (!res.ok) {
        if (res.status === 404) {
          console.warn(`fetchApi: ${url} returned 404, trying next candidate.`);
          continue;
        }
        return res;
      }

      if (contentType.includes('application/json')) {
        return res;
      }

      console.warn(`fetchApi: ${url} returned non-JSON content type ${contentType}`);
      continue;
    } catch (err) {
      lastError = err;
      console.warn(`fetchApi: request failed for ${url}`, err);
    }
  }

  if (lastNon404Response) {
    return lastNon404Response;
  }
  if (lastError) {
    throw lastError;
  }

  return new Response(null, { status: 404, statusText: 'Not Found' });
};
