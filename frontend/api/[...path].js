const BACKEND_URL = process.env.API_BACKEND_URL || process.env.VITE_API_URL || 'https://code-web-academy.onrender.com';

export default async function handler(req, res) {
  const apiPath = req.url.replace(/^\/api/, '') || '/';
  const targetUrl = `${BACKEND_URL}/api${apiPath}`;

  const headers = { ...req.headers };
  delete headers.host;

  let body;
  if (!['GET', 'HEAD'].includes(req.method)) {
    if (typeof req.body === 'string' || req.body instanceof Uint8Array || req.body instanceof Buffer) {
      body = req.body;
    } else {
      body = JSON.stringify(req.body || {});
      if (!headers['content-type'] && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
    }
  }

  try {
    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body
    });

    const responseBody = await backendResponse.arrayBuffer();
    backendResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'transfer-encoding') return;
      res.setHeader(key, value);
    });
    res.status(backendResponse.status).send(Buffer.from(responseBody));
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(502).json({ message: 'Backend proxy error' });
  }
}
