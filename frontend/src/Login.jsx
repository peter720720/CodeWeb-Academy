import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiBase } from './api';

function Login({ onLogin, admin = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');

    try {
      const API_BASE = getApiBase();
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });

      const result = await response.json();
      if (response.ok) {
        if (onLogin) {
          onLogin({ user: result.user, token: result.token });
        }
        setStatus('Login successful! Redirecting...');
        if (admin) {
          setTimeout(() => navigate('/admin/collections'), 800);
        } else {
          const courseId = result.user?.selectedCourse || 'frontend';
          setTimeout(() => navigate(`/track/${courseId}`), 1200);
        }
        return;
      }

      setStatus(result.message || 'Login failed.');
    } catch (error) {
      setStatus('Network failed. Please check your connection.');
    }
  };

  return (
    <section className="section-block enroll-page">
      <div className="section-title">
        <span className="eyebrow">Welcome Back</span>
        <h2>Login to your CodeWeb account</h2>
        <p>Enter your email and password to continue.</p>
      </div>

      <form className="enroll-form" onSubmit={handleSubmit}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontWeight: '600' }}>Email Address</span>
          <input
            type="email"
            name="email"
            placeholder="Enter your registered email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--input-border)' }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <span style={{ fontWeight: '600' }}>Password</span>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--input-border)' }}
          />
        </label>

        <button className="button button-primary" type="submit" style={{ width: '100%', padding: '14px' }}>
          Sign In
        </button>

        {status && (
          <div className={`form-status ${status === 'success' ? 'success' : 'error'}`} style={{ marginTop: '16px', padding: '12px', borderRadius: '8px' }}>
            {status === 'submitting' ? 'Signing in…' : status}
          </div>
        )}
      </form>
    </section>
  );
}

export default Login;
