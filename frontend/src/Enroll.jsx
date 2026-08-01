import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiBase } from './api';

function Enroll({ courses }) {
  // Default the initial state value to 'none'
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', course: 'none' });
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
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          selectedCourse: form.course // Sends 'none' or the selected course ID to your backend
        })
      });

      const result = await response.json();
      if (response.ok) {
        setStatus('Signup successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1200);
        return;
      }

      setStatus(result.message || 'Something went wrong.');
    } catch (error) {
      setStatus('Network failed. Please check the backend or your connection.');
    }
  };

  return (
    <section className="section-block enroll-page">
      <div className="section-title">
        <span className="eyebrow">Enroll Today</span>
        <h2>Reserve your spot in the CodeWeb course that fits your goals.</h2>
        <p>Complete the form below and we’ll confirm your enrollment with next steps.</p>
      </div>

      <form className="enroll-form" onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontWeight: '600' }}>Full Name</span>
            <input 
              type="text"
              name="fullName" 
              placeholder="Type your first and last name here"
              value={form.fullName} 
              onChange={handleChange} 
              required 
              style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--input-border)' }}
            />
          </label>
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontWeight: '600' }}>Email Address</span>
          <input 
            type="email" 
            name="email" 
            placeholder="Type your email address here (e.g., name@gmail.com)"
            value={form.email} 
            onChange={handleChange} 
            required 
            style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--input-border)' }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontWeight: '600' }}>Password</span>
          <input
            type="password"
            name="password"
            placeholder="Create a secure password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--input-border)' }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontWeight: '600' }}>Select Course</span>
          <select 
            name="course" 
            value={form.course} 
            onChange={handleChange}
            style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--input-border)', background: 'var(--input-bg)' }}
          >
            {/* Added selectable 'None' option back to the top of the dropdown */}
            <option value="none">None</option>
            {courses && courses.map((course) => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </label>

        <p style={{ margin: '0 0 24px 0', color: 'var(--muted-color)', fontSize: '0.95rem' }}>
          Already have an account? <a href="#/login" style={{ color: 'var(--accent-color)', fontWeight: 700 }}>Login</a>
        </p>

        <button className="button button-primary" type="submit" style={{ width: '100%', padding: '14px' }}>
          Submit Enrollment
        </button>

        {status && (
          <div className={`form-status ${status === 'success' ? 'success' : 'error'}`} style={{ marginTop: '16px', padding: '12px', borderRadius: '8px' }}>
            {status === 'submitting' ? 'Sending enrollment...' : status}
          </div>
        )}
      </form>
    </section>
  );
}

export default Enroll;
