import React, { useState } from 'react';
import { getApiBase } from './api';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const API_BASE = getApiBase();
      const response = await fetch(`${API_BASE}/api/admin/contact-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Unable to send message.');
      }

      setStatus({ type: 'success', message: 'Message sent successfully. We will reply shortly.' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact submit failed:', err);
      setStatus({ type: 'error', message: err.message || 'Message submission failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-block contact-page" style={{ paddingTop: '48px', paddingBottom: '64px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gap: '20px', marginBottom: '42px' }}>
          <span className="eyebrow">Get in touch</span>
          <div>
            <h2 style={{ fontSize: 'clamp(2.4rem, 3vw, 3.6rem)', marginBottom: '18px', lineHeight: 1.05 }}>Contact CodeWeb Academy</h2>
            <p style={{ maxWidth: '760px', lineHeight: '1.85', color: 'var(--muted-color, #b8c5e0)' }}>
              Have questions, want to discuss a tailored learning path, or need help choosing the right course? Send us a message and our team will get back to you promptly.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div style={{ padding: '32px', borderRadius: '32px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.18)' }}>
            <p style={{ margin: 0, color: 'var(--accent-color)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Contact Info</p>
            <h3 style={{ marginTop: '18px', marginBottom: '20px', fontSize: '1.7rem' }}>We're here to help</h3>
            <div style={{ display: 'grid', gap: '14px', color: 'var(--muted-color, #d1d9f2)' }}>
              <div>
                <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>Email</p>
                <a href="mailto:support@codeweb.academy" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>support@codeweb.academy</a>
              </div>
              <div>
                <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>Phone</p>
                <a href="tel:+1234567890" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>+1 (234) 567-890</a>
              </div>
              <div>
                <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>Office</p>
                <p style={{ margin: 0 }}>123 CodeWeb Lane, Tech City</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '32px', borderRadius: '32px', background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.18)' }}>
            <p style={{ margin: 0, color: 'var(--accent-color)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Send a message</p>
            <h3 style={{ marginTop: '18px', marginBottom: '20px', fontSize: '1.7rem' }}>Let us know how we can support you</h3>
            <form style={{ display: 'grid', gap: '18px' }} onSubmit={handleSubmit}>
              <label style={{ display: 'grid', gap: '10px', color: '#d9e1ff', fontWeight: 500 }}>
                Name
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.04)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </label>
              <label style={{ display: 'grid', gap: '10px', color: '#d9e1ff', fontWeight: 500 }}>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  required
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.04)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </label>
              <label style={{ display: 'grid', gap: '10px', color: '#d9e1ff', fontWeight: 500 }}>
                Message
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what you need"
                  rows="6"
                  required
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.04)',
                    color: '#fff',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </label>
              <button
                type="submit"
                className="button button-primary"
                disabled={loading}
                style={{
                  width: 'fit-content',
                  padding: '16px 38px',
                  borderRadius: '999px',
                  boxShadow: '0 18px 40px rgba(37, 99, 235, 0.24)'
                }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
              {status && (
                <div style={{ marginTop: '12px', color: status.type === 'success' ? '#98ff9a' : '#ff9a9a' }}>
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>

        <div style={{ marginTop: '42px', display: 'grid', gap: '24px', padding: '32px', borderRadius: '32px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.18)' }}>
          <div style={{ display: 'grid', gap: '16px', maxWidth: '820px', margin: '0 auto' }}>
            <p style={{ margin: 0, color: 'var(--accent-color)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Need help choosing the right path?</p>
            <h3 style={{ margin: '0', fontSize: '1.9rem', lineHeight: 1.1 }}>We can guide you to the best track for your goals.</h3>
            <p style={{ margin: 0, color: 'var(--muted-color, #d1d9f2)', lineHeight: 1.85 }}>
              Whether you want to build websites, launch a career in backend, or learn product design, our team is ready to match you with the right learning track. Share your goals, and we’ll suggest the best pathway, timeline, and next steps.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <div style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>Fast response</p>
              <p style={{ marginTop: '10px', color: 'var(--muted-color, #d1d9f2)' }}>Our support team replies within 24 hours on weekdays.</p>
            </div>
            <div style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>Guided enrollment</p>
              <p style={{ marginTop: '10px', color: 'var(--muted-color, #d1d9f2)' }}>We help you choose the right course track based on your experience level.</p>
            </div>
            <div style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>Real student support</p>
              <p style={{ marginTop: '10px', color: 'var(--muted-color, #d1d9f2)' }}>Get answers from our advisors and access mentorship opportunities.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
