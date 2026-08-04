import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getApiBase, fetchApi } from './api';

function AdminHeader({ accentColor, title }) {
  return (
    <div className="section-title">
      <span className="eyebrow">Admin Dashboard</span>
      <h1 style={{ color: accentColor, margin: '12px 0 20px', fontSize: 'clamp(2rem, 3vw, 3.5rem)' }}>
        {title}
      </h1>
      <p style={{ maxWidth: '760px', lineHeight: 1.8, color: 'var(--muted-color, #a6b4d8)' }}>
        Manage students, messages, outlines, and course media from the admin dashboard.
      </p>
    </div>
  );
}


function CoursePricingPage({ accentColor, courses, onCoursePriceUpdate }) {
  const [priceMap, setPriceMap] = useState(() => (
    courses.reduce((map, course) => {
      map[course.id] = course.price || 0;
      return map;
    }, {})
  ));
  const [status, setStatus] = useState(null);

  const formatPrice = (value) => {
    if (value === 0) return 'Pending';
    if (value == null || value === '') return 'Contact for pricing';
    return `₦${Number(value).toLocaleString()}`;
  };

  const handlePriceChange = (courseId, value) => {
    const nextValue = value.replace(/[^0-9]/g, '');
    setPriceMap((prev) => ({ ...prev, [courseId]: Number(nextValue) }));
  };

  const handleSavePrice = async (courseId) => {
    const nextPrice = Number(priceMap[courseId] || 0);
    onCoursePriceUpdate(courseId, nextPrice);
    setStatus(`Updated ${courses.find((course) => course.id === courseId)?.title} to ${formatPrice(nextPrice)}`);
    window.setTimeout(() => setStatus(null), 2500);
  };

  return (
    <section className="section-block admin-page" style={{ paddingTop: '28px' }}>
      <AdminHeader accentColor={accentColor} title="Course Pricing" />
      <div style={{ display: 'grid', gap: '24px' }}>
        <div style={{ padding: '28px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <h2 style={{ color: accentColor, marginBottom: '16px' }}>Update Course Amounts</h2>
          {status && <p style={{ color: '#98ff9a' }}>{status}</p>}
          <div style={{ display: 'grid', gap: '18px' }}>
            {courses.map((course) => (
              <div key={course.id} style={{ display: 'grid', gap: '10px', padding: '18px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>{course.title}</p>
                    <p style={{ margin: '6px 0 0', color: 'var(--muted-color)' }}>{course.description}</p>
                  </div>
                  <p style={{ margin: 0, fontWeight: 700, color: accentColor }}>{formatPrice(course.price)}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 220px' }}>
                    <span style={{ fontWeight: 600 }}>Set amount</span>
                    <input
                      type="text"
                      value={priceMap[course.id] ?? ''}
                      onChange={(e) => handlePriceChange(course.id, e.target.value)}
                      placeholder="Enter amount"
                      style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-color)' }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSavePrice(course.id)}
                    style={{ padding: '12px 24px', borderRadius: '999px', background: accentColor, color: '#fff', border: 'none', alignSelf: 'end' }}
                  >
                    Save price
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseSchedulePage({ accentColor, courses, onCourseScheduleUpdate }) {
  const [scheduleMap, setScheduleMap] = useState(() => (
    courses.reduce((acc, course) => {
      acc[course.id] = {
        date: course.scheduleDate || '',
        time: course.scheduleTime || ''
      };
      return acc;
    }, {})
  ));
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setScheduleMap(courses.reduce((acc, course) => {
      acc[course.id] = {
        date: course.scheduleDate || '',
        time: course.scheduleTime || ''
      };
      return acc;
    }, {}));
  }, [courses]);

  const handleChange = (courseId, field, value) => {
    setScheduleMap((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [field]: value
      }
    }));
  };

  const handleSaveSchedule = async (courseId) => {
    const nextSchedule = scheduleMap[courseId] || { date: '', time: '' };
    await onCourseScheduleUpdate(courseId, nextSchedule);
    setStatus(`Updated schedule for ${courses.find((course) => course.id === courseId)?.title}`);
    window.setTimeout(() => setStatus(null), 2500);
  };

  return (
    <section className="section-block admin-page" style={{ paddingTop: '28px' }}>
      <AdminHeader accentColor={accentColor} title="Course Schedule" />
      <div className="admin-block">
        <div className="admin-card admin-panel">
          <h2 style={{ color: accentColor, marginBottom: '16px' }}>Set class dates and times for each course.</h2>
          {status && <p style={{ color: '#98ff9a' }}>{status}</p>}
          <div className="admin-card-list">
            {courses.map((course) => {
              const current = scheduleMap[course.id] || { date: '', time: '' };
              return (
                <div key={course.id} className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <p style={{ margin: 0, fontWeight: 700 }}>{course.title}</p>
                      <p style={{ margin: '6px 0 0', color: 'var(--muted-color)' }}>{course.description}</p>
                    </div>
                    <div className="admin-card-meta">
                      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--muted-color)' }}>Date</p>
                      <p style={{ margin: 0, fontWeight: 700 }}>{current.date || 'Not set'}</p>
                      <p style={{ margin: '6px 0 0', fontSize: '0.95rem', color: 'var(--muted-color)' }}>Time</p>
                      <p style={{ margin: 0, fontWeight: 700 }}>{current.time || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="admin-form-grid">
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontWeight: 600 }}>Scheduled Date</span>
                      <input
                        type="date"
                        value={current.date}
                        onChange={(e) => handleChange(course.id, 'date', e.target.value)}
                        style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-color)' }}
                      />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontWeight: 600 }}>Scheduled Time</span>
                      <input
                        type="time"
                        value={current.time}
                        onChange={(e) => handleChange(course.id, 'time', e.target.value)}
                        style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-color)' }}
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveSchedule(course.id)}
                    className="admin-button"
                  >
                    Save schedule
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CollectionsPage({ accentColor }) {
  const [stats, setStats] = useState({ studentCount: 0, messageCount: 0, studentMessageCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = localStorage.getItem('codewebToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetchApi('/api/admin/stats', { headers });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.message || 'Unable to load admin stats');
        }

        const data = await response.json();
        setStats({
          studentCount: data.studentCount ?? 0,
          messageCount: data.messageCount ?? 0,
          studentMessageCount: data.studentMessageCount ?? 0
        });
      } catch (err) {
        console.error('Load admin stats failed:', err);
        setError('Login as admin to see live registration and message counts.');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <section className="section-block admin-page" style={{ paddingTop: '28px' }}>
      <AdminHeader accentColor={accentColor} title="Collections Overview" />
      <div style={{ display: 'grid', gap: '24px' }}>
        <div style={{ display: 'grid', gap: '18px', padding: '28px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <h2 style={{ color: accentColor }}>Student / Message Snapshot</h2>
          {loading ? (
            <p style={{ color: 'var(--muted-color)' }}>Loading dashboard statistics...</p>
          ) : error ? (
            <p style={{ color: '#ff8b8b' }}>{error}</p>
          ) : (
            <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)' }}>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--muted-color)' }}>Registered Students</p>
                <p style={{ margin: '10px 0 0', fontSize: '2rem', fontWeight: 700 }}>{stats.studentCount}</p>
              </div>
              <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)' }}>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--muted-color)' }}>Messages Received</p>
                <p style={{ margin: '10px 0 0', fontSize: '2rem', fontWeight: 700 }}>{stats.messageCount}</p>
              </div>
              <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)' }}>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--muted-color)' }}>Students who Sent Messages</p>
                <p style={{ margin: '10px 0 0', fontSize: '2rem', fontWeight: 700 }}>{stats.studentMessageCount}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MessagesPage({ accentColor }) {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMessages() {
      setLoading(true);
      try {
        const token = localStorage.getItem('codewebToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetchApi('/api/admin/messages', { headers });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.message || 'Unable to load messages');
        }
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Load messages failed:', err);
        setError('Unable to load messages.');
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      const token = localStorage.getItem('codewebToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetchApi(`/api/admin/messages/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Delete failed');
      setMessages((cur) => cur.filter((m) => (m._id ? m._id !== id : m.id !== id)));
    } catch (err) {
      console.error('Delete message failed:', err);
      alert('Unable to delete message');
    }
  };

  const handleReply = async () => {
    if (!activeId || !replyText.trim()) return;
    try {
      const API_BASE = getApiBase();
      const token = localStorage.getItem('codewebToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const payload = { reply: replyText.trim() };
      const res = await fetchApi(`/api/admin/messages/${activeId}/reply`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || 'Unable to save reply');
      }

      const result = await res.json();
      const updatedMessage = result.data;
      setMessages((current) => current.map((item) => {
        const itemId = item._id || item.id;
        if (itemId === activeId) return { ...item, reply: updatedMessage.reply };
        return item;
      }));
      setReplyText('');
    } catch (err) {
      console.error('Reply failed:', err);
      alert('Unable to save reply.');
    }
  };

  return (
    <section className="section-block admin-page" style={{ paddingTop: '28px' }}>
      <AdminHeader accentColor={accentColor} title="Messages Inbox" />
      <div style={{ display: 'grid', gap: '24px' }}>
        <div style={{ padding: '28px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <h2 style={{ color: accentColor, marginBottom: '16px' }}>Messages</h2>
          <div style={{ display: 'grid', gap: '18px' }}>
            {loading ? (
              <p style={{ color: 'var(--muted-color)' }}>Loading messages…</p>
            ) : error ? (
              <p style={{ color: '#ff8b8b' }}>{error}</p>
            ) : messages.length === 0 ? (
              <p style={{ color: 'var(--muted-color)' }}>No messages yet.</p>
            ) : (
              messages.map((item) => (
                <div key={item._id || item.id} style={{ padding: '22px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', position: 'relative' }}>
                  <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-color)' }}>{item.name} <span style={{ color: 'var(--muted-color)', fontWeight: 500 }}>({item.email})</span></p>
                  <p style={{ margin: '12px 0 0', color: 'var(--muted-color)' }}>{item.message}</p>
                  <p style={{ margin: '12px 0 0', fontStyle: 'italic', color: item.reply ? accentColor : 'var(--muted-color)' }}>
                    Reply: {item.reply || 'No reply yet.'}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveId(item._id || item.id)}
                      style={{ padding: '10px 18px', borderRadius: '999px', background: accentColor, color: '#fff', border: 'none' }}
                    >
                      Reply to this message
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMessage(item._id || item.id)}
                      style={{ padding: '10px 18px', borderRadius: '999px', background: 'transparent', color: accentColor, border: `1px solid ${accentColor}` }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ marginTop: '24px', display: 'grid', gap: '14px' }}>
            <p style={{ margin: 0, color: 'var(--muted-color)' }}>Selected message ID: {activeId || 'None'}</p>
            <textarea
              rows="4"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{ width: '100%', borderRadius: '18px', padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-color)' }}
              placeholder="Write your reply here..."
            />
            <button
              type="button"
              onClick={handleReply}
              style={{ width: 'fit-content', padding: '12px 22px', borderRadius: '999px', background: accentColor, color: '#fff', border: 'none' }}
            >
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function UploadsPage({ accentColor }) {
  const [outlineFile, setOutlineFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  return (
    <section className="section-block admin-page" style={{ paddingTop: '28px' }}>
      <AdminHeader accentColor={accentColor} title="Upload Course Materials" />
      <div style={{ display: 'grid', gap: '24px' }}>
        <div style={{ padding: '28px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <h2 style={{ color: accentColor }}>Upload Course Outlines & Images</h2>
          <div style={{ display: 'grid', gap: '18px' }}>
            <label style={{ display: 'grid', gap: '10px', color: 'var(--text-color)' }}>
              Outline file
              <input
                type="file"
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setOutlineFile(e.target.files?.[0] || null)}
                style={{ padding: '12px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-color)' }}
              />
            </label>
            <label style={{ display: 'grid', gap: '10px', color: 'var(--text-color)' }}>
              Course image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                style={{ padding: '12px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-color)' }}
              />
            </label>
            <div style={{ display: 'grid', gap: '10px' }}>
              <p style={{ margin: 0, color: 'var(--muted-color)' }}>Selected outline: {outlineFile ? outlineFile.name : 'None'}</p>
              <p style={{ margin: 0, color: 'var(--muted-color)' }}>Selected image: {imageFile ? imageFile.name : 'None'}</p>
            </div>
            <button
              type="button"
              style={{ width: 'fit-content', padding: '12px 22px', borderRadius: '999px', background: accentColor, color: '#fff', border: 'none' }}
            >
              Upload materials
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Admin({ accentColor, courses, onCoursePriceUpdate, onCourseScheduleUpdate }) {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(Boolean(localStorage.getItem('codewebToken')));

  useEffect(() => {
    // Update auth flag whenever location changes (navigation after login/logout)
    setIsAuth(Boolean(localStorage.getItem('codewebToken')));
  }, [location.pathname]);

  useEffect(() => {
    // Listen for token changes in other tabs/windows
    const handleStorage = (e) => {
      if (e.key === 'codewebToken') setIsAuth(Boolean(localStorage.getItem('codewebToken')));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  function AdminLogin() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
      e.preventDefault();
      setStatus('submitting');
      try {
        const API_BASE = getApiBase();
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password })
        });
        const result = await res.json();
        if (res.ok) {
          localStorage.setItem('codewebToken', result.token);
          setStatus('success');
          setTimeout(() => navigate('/admin/collections'), 600);
          return;
        }
        setStatus(result.message || 'Login failed');
      } catch (err) {
        setStatus('Network error');
      }
    };

    return (
      <section className="section-block admin-login" style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '640px', padding: '28px', borderRadius: '18px', background: 'rgba(255,255,255,0.02)', boxShadow: '0 6px 18px rgba(2,6,23,0.6)' }}>
          <h2 style={{ marginTop: 0, color: accentColor }}>Admin Sign In</h2>
          <p style={{ color: 'var(--muted-color)' }}>Enter your admin credentials to access the dashboard.</p>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontWeight: 600 }}>Email Address</span>
              <input name="email" placeholder="Enter your admin email" value={form.email} onChange={handleChange} required style={{ padding: '12px', borderRadius: '10px' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontWeight: 600 }}>Password</span>
              <input name="password" type="password" placeholder="Enter your admin password" value={form.password} onChange={handleChange} required style={{ padding: '12px', borderRadius: '10px' }} />
            </label>
            <button type="submit" style={{ padding: '12px', borderRadius: '999px', background: accentColor, color: '#fff', border: 'none' }}>Sign In</button>
            {status && <div style={{ color: status === 'success' ? 'var(--success-color, #0f9d58)' : '#ff8b8b' }}>{status === 'submitting' ? 'Signing in…' : status}</div>}
          </form>
        </div>
      </section>
    );
  }
  if (!isAuth) {
    if (location.pathname === '/admin/login' || location.pathname === '/admin/login/') {
      return <AdminLogin />;
    }
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <section className="admin-page" style={{ paddingTop: '16px', paddingBottom: '0' }}>
      <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
        <Routes>
          <Route path="collections" element={<CollectionsPage accentColor={accentColor} />} />
          <Route path="messages" element={<MessagesPage accentColor={accentColor} />} />
          <Route path="pricing" element={<CoursePricingPage accentColor={accentColor} courses={courses} onCoursePriceUpdate={onCoursePriceUpdate} />} />
          <Route path="schedule" element={<CourseSchedulePage accentColor={accentColor} courses={courses} onCourseScheduleUpdate={onCourseScheduleUpdate} />} />
          <Route path="uploads" element={<UploadsPage accentColor={accentColor} />} />
          <Route path="*" element={<CollectionsPage accentColor={accentColor} />} />
        </Routes>
      </div>
    </section>
  );
}

export default Admin;
