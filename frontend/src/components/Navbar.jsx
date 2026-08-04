import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar({ user, accentColor, currentThemeId, colors, onColorChange, onLogout, theme }) {
  const location = useLocation();
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const colorRef = useRef(null);
  const isAdminRoute = location.pathname.startsWith('/admin');
  const navigate = useNavigate();
  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('codewebToken') : null;
  const links = isAdminRoute
    ? (adminToken ? [
      { to: '/admin/collections', label: 'Collections' },
      { to: '/admin/messages', label: 'Messages' },
      { to: '/admin/pricing', label: 'Pricing' },
      { to: '/admin/schedule', label: 'Schedule' },
      { to: '/admin/uploads', label: 'Uploads' }
    ] : [])
    : [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
      { to: '/courses', label: 'Courses' },
      ...(user && user.selectedCourse ? [{ to: `/track/${user.selectedCourse}`, label: 'Track' }] : []),
      { to: '/opportunities', label: 'Opportunities' },
      { to: '/contact', label: 'Contact' },
      ...(!user ? [{ to: '/enroll', label: 'Enroll Now' }] : [])
    ];

  useEffect(() => {
    function handleOutside(e) {
      // Close overlays when clicking outside of their panels
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (isColorOpen && colorRef.current && !colorRef.current.contains(e.target)) {
        setIsColorOpen(false);
      }
    }

    function handleEsc(e) {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsColorOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleEsc);

    // Prevent page scroll when either overlay is open
    if (isMenuOpen || isColorOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isColorOpen]);


  const getLogoFilter = () => 'none';

  return (
    <header className="site-header">
      <Link to={isAdminRoute ? '/admin' : '/'} className="brand brand-link">
        <img 
          src="/logo-3.png" 
          alt="CodeWeb logo" 
          style={{ 
            height: '110px', 
            width: '110px', 
            objectFit: 'contain',
            display: 'block',
            margin: '-20px 0',
            maxWidth: 'none', 
            maxHeight: 'none',
            filter: getLogoFilter(),
            transition: 'filter 0.25s ease'
          }} 
        />
      </Link>

      <nav
        className={`nav-links ${isMenuOpen ? 'open' : ''}`}
        ref={menuRef}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <button type="button" className="nav-close" aria-label="Close menu" onClick={() => setIsMenuOpen(false)}>×</button>
        <div className="nav-panel">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `nav-link ${link.to === '/enroll' ? 'enroll-button' : ''} ${isActive ? 'active' : ''}`.trim()}
            >
              {link.label}
            </NavLink>
          ))}

          {(user || adminToken) && (
            <button
              type="button"
              className="nav-link logout-button menu-logout"
              onClick={() => {
                setIsMenuOpen(false);
                onLogout();
                navigate(isAdminRoute ? '/admin/login' : '/');
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Unified right-side container tools column */}
      <div className="nav-tools">
        {/* The Hamburger Menu button sits cleanly on top */}
        <button
          type="button"
          className={`hamburger ${isMenuOpen ? 'open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen((p) => {
              const next = !p;
              if (next) setIsColorOpen(false);
              return next;
            });
          }}
        >
          <span />
          <span />
          <span />
        </button>

        {/* The Theme Spinning wheel is stacked directly underneath */}
        {(user || adminToken) ? (
          <button
            type="button"
            className="nav-link logout-button"
            onClick={() => {
              setIsMenuOpen(false);
              onLogout();
              navigate(isAdminRoute ? '/admin/login' : '/');
            }}
          >
            Logout
          </button>
        ) : null}

        <button
          type="button"
          className={`color-toggle ${isColorOpen ? 'open' : ''}`}
          onTouchStart={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setIsColorOpen((p) => {
              const next = !p;
              if (next) setIsMenuOpen(false);
              return next;
            });
          }}
          aria-expanded={isColorOpen}
          aria-label="Toggle settings"
        >
          <svg
            viewBox="0 0 512 512"
            className="settings-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path d="M487.4 315.7l-42.9-24.8c2.6-13.5 2.6-27.6 0-41.1l42.9-24.8c18.7-10.8 25-35.1 14.2-53.8l-29.6-51.4c-10.8-18.7-35.1-25-53.8-14.2l-42.9 24.8c-22.6-18.3-49.6-32-79.4-40.2V24.6C328.9 11 318 0 304.4 0h-59c-13.6 0-24.5 11-24.5 24.6v49.7c-29.8 8.3-56.8 21.9-79.4 40.2L98.6 90.1C79.9 79.3 55.6 85.6 44.8 104.3L15.2 155.7C4.4 174.4 10.7 198.7 29.4 209.5l42.9 24.8c-2.6 13.5-2.6 27.6 0 41.1l-42.9 24.8C10.7 336.3 4.4 360.6 15.2 379.3l29.6 51.4c10.8 18.7 35.1 25 53.8 14.2l42.9-24.8c22.6 18.3 49.6 32 79.4 40.2v49.7C220.9 501 231.8 512 245.4 512h59c13.6 0 24.5-11 24.5-24.6v-49.7c29.8-8.3 56.8-21.9 79.4-40.2l42.9 24.8c18.7 10.8 43 4.5 53.8-14.2l29.6-51.4c10.8-18.7 4.5-43-14.2-53.8zM256 352c-52.9 0-96-43.1-96-96s43.1-96 96-96 96 43.1 96 96-43.1 96-96 96z" />
          </svg>
        </button>

        <div
          ref={colorRef}
          className={`color-panel ${isColorOpen ? 'active' : ''}`}
          onTouchStart={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              className={`color-swatch ${currentThemeId === color.id ? 'active' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => onColorChange(color)}
              aria-label={`Select ${color.label}`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
