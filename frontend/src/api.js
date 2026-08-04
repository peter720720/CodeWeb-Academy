const DEFAULT_LOCAL_API = 'http://localhost:3500';

const buildApiCandidates = () => {
  const candidates = [];
  const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';

  if (import.meta.env.MODE === 'production') {
    if (origin) {
      candidates.push(origin);
    }
    if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== origin) {
      candidates.push(import.meta.env.VITE_API_URL);
    }
  } else {
    candidates.push(DEFAULT_LOCAL_API);
    if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== DEFAULT_LOCAL_API) {
      candidates.push(import.meta.env.VITE_API_URL);
    }
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
