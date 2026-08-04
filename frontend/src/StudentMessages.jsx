import { useEffect, useState } from 'react';
import { getApiBase } from './api';

function StudentMessages({ accentColor }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStudentMessages() {
      const API_BASE = getApiBase();
      const token = localStorage.getItem('codewebToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      // Attempt primary configured API base first, then fall back to same-origin.
      const candidates = [`${API_BASE}/api/admin/student/messages`, '/api/admin/student/messages'];

      for (const url of candidates) {
        try {
          const res = await fetch(url, { headers });
          if (!res.ok) {
            // If 404 try next candidate, otherwise treat as an error we can't recover from.
            if (res.status === 404) {
              console.warn(`Student messages endpoint returned 404 at ${url}, trying fallback.`);
              continue;
            }
            const body = await res.json().catch(() => null);
            throw new Error(body?.message || `Unable to load messages (status ${res.status}).`);
          }

          const data = await res.json();
          setMessages(Array.isArray(data) ? data : []);
          setError(null);
          return;
        } catch (err) {
          console.warn('Student messages fetch failed for', url, err);
          // try next candidate
        }
      }

      setError('Unable to load your messages.');
      setLoading(false);
    }

    loadStudentMessages();
  }, []);

  return (
    <section className="section-block course-page" style={{ paddingTop: '28px' }}>
      <div className="section-title">
        <span className="eyebrow">Your Messages</span>
        <h2>Your admin replies</h2>
        <p>See the responses from CodeWeb admin to your support messages.</p>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {loading ? (
          <p style={{ color: 'var(--muted-color)' }}>Loading your replies…</p>
        ) : error ? (
          <p style={{ color: '#ff8b8b' }}>{error}</p>
        ) : messages.length === 0 ? (
          <p style={{ color: 'var(--muted-color)' }}>No replies yet. Admin responses will appear here when available.</p>
        ) : (
          messages.map((item) => (
            <div
              key={item._id || item.id}
              style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--muted-color)' }}>{new Date(item.createdAt).toLocaleDateString()}</p>
                <p style={{ margin: 0, color: accentColor, fontWeight: 700 }}>{item.name}</p>
              </div>
              <p style={{ margin: '14px 0 0', color: 'var(--text-color)' }}><strong>Your message:</strong> {item.message}</p>
              <p style={{ margin: '12px 0 0', color: item.reply ? '#dbeafe' : 'var(--muted-color)' }}>
                <strong>Admin reply:</strong> {item.reply || 'No reply yet.'}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default StudentMessages;
