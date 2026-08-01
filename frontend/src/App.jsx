import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Home';
import Courses from './Courses';
import Enroll from './Enroll';
import Login from './Login';
import CourseDetail from './CourseDetail';
import Contact from './Contact';
import About from './About';
import Opportunities from './Opportunities';
import Footer from './Footer';
import Loader from './components/Loader';

const defaultCourses = [
  { id: 'frontend', title: 'Frontend Development', description: 'Build interfaces with modern web technologies.', details: 'HTML, CSS, JavaScript, React, Vite and real projects.', category: 'Frontend', image: 'https://unsplash.com' },
  { id: 'backend', title: 'Backend Development', description: 'APIs, databases, authentication and deployment.', details: 'Node.js, Express, MongoDB, REST and best practices.', category: 'Backend', image: 'https://unsplash.com' },
  { id: 'fullstack', title: 'Full-Stack Development', description: 'End-to-end web development skills.', details: 'Frontend + Backend + Deployment workflows and CI/CD.', category: 'Full-Stack', image: 'https://unsplash.com' },
  { id: 'cyber', title: 'Cybersecurity', description: 'Fundamentals of secure systems and defense.', details: 'Threat modelling, secure coding, and basic forensics.', category: 'Security', image: 'https://unsplash.com' },
  { id: 'data', title: 'Data Analysis', description: 'Learn to analyze and visualize data.', details: 'Python, SQL, statistics, and visualization tools.', category: 'Data', image: 'https://unsplash.com' },
  { id: 'graphics', title: 'Graphics Design', description: 'Design for web and product interfaces.', details: 'Visual design, Figma, composition, and prototyping.', category: 'Design', image: 'https://unsplash.com' },
  { id: 'production', title: 'Production Design', description: 'Ship polished products and systems.', details: 'Design systems, accessibility, and production readiness.', category: 'Design', image: 'https://unsplash.com' },
  { id: 'product', title: 'Product Management', description: 'Understand product discovery and delivery.', details: 'Roadmaps, discovery, user research, and stakeholder management.', category: 'Product', image: 'https://unsplash.com' }
];

const colorOptions = [
  { id: 'blue', label: 'Blue', value: '#2563eb' },
  { id: 'pink', label: 'Pink', value: '#ff4d6d' },
  { id: 'green', label: 'Green', value: '#10b981' },
  { id: 'teal', label: 'Teal', value: '#06b6d4' },
  { id: 'purple', label: 'Purple', value: '#7c3aed' },
  { id: 'gold', label: 'Gold', value: '#f59e0b' },
  { id: 'white', label: 'White', value: '#ffffff' },
  { id: 'black', label: 'Black', value: '#000000' }
];

function App() {
  const [courses] = useState(defaultCourses);
  const [user, setUser] = useState(null);
  const [accentColor, setAccentColor] = useState(colorOptions[0].value);
  const [currentThemeId, setCurrentThemeId] = useState(colorOptions[0].id);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('codewebToken');
    if (token) {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3500';
      fetch(`${API_BASE}/api/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(async (response) => {
          if (!response.ok) {
            localStorage.removeItem('codewebToken');
            setUser(null);
            return;
          }
          const result = await response.json();
          setUser(result.user);
        })
        .catch(() => {
          localStorage.removeItem('codewebToken');
          setUser(null);
        });
    }

    document.documentElement.style.setProperty('--accent-color', accentColor);
    
    function lightenHex(hex, percent) {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = (num >> 16) + Math.round(255 * percent);
      const g = ((num >> 8) & 0x00ff) + Math.round(255 * percent);
      const b = (num & 0x0000ff) + Math.round(255 * percent);
      const rr = Math.min(255, Math.max(0, r)).toString(16).padStart(2, '0');
      const gg = Math.min(255, Math.max(0, g)).toString(16).padStart(2, '0');
      const bb = Math.min(255, Math.max(0, b)).toString(16).padStart(2, '0');
      return `#${rr}${gg}${bb}`;
    }
    const end = lightenHex(accentColor, 0.25);
    document.documentElement.style.setProperty('--accent-gradient-end', end);
  }, [accentColor]);

  // TRIGGER AUTOMATIC SPLASH SCREEN TIMER ON LAUNCH/REFRESH
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Hide loader after 5 seconds
    }, 5000); // Set to 5000ms for exact 5-second duration tracking

    return () => clearTimeout(timer);
  }, []);

  const handleColorChange = (color) => {
    if (color.id === 'white') {
      setTheme('white');
      document.documentElement.style.setProperty('--background-color', '#ffffff');
      document.documentElement.style.setProperty('--text-color', '#0f172a');
      setCurrentThemeId(color.id);
    } else if (color.id === 'black') {
      setTheme('dark');
      document.documentElement.style.setProperty('--background-color', '#000000');
      document.documentElement.style.setProperty('--text-color', '#f7f8fb');
      setCurrentThemeId(color.id);
    } else {
      setAccentColor(color.value);
      setCurrentThemeId(color.id);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <HashRouter>
      <div className={`app-shell ${theme === 'dark' ? 'dark-theme' : 'white-theme'}`}>
        {/* Pass your live active theme state value right here */}
        <Navbar 
          user={user}
          accentColor={accentColor} 
          currentThemeId={currentThemeId} 
          colors={colorOptions} 
          onColorChange={handleColorChange} 
          theme={theme} 
        />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home courses={courses} accentColor={accentColor} />} />
            <Route path="/about" element={<About />} /> 
            <Route path="/courses" element={<Courses courses={courses} accentColor={accentColor} />} />
            <Route path="/enroll" element={<Enroll courses={courses} accentColor={accentColor} />} />
            <Route path="/login" element={<Login courses={courses} onLogin={({ user, token }) => {
              setUser(user);
              localStorage.setItem('codewebToken', token);
            }} />} />
            <Route path="/track/:id" element={<CourseDetail courses={courses} user={user} />} />
            <Route path="/opportunities" element={<Opportunities accentColor={accentColor} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home courses={courses} accentColor={accentColor} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
