import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';

function Navbar({ accentColor, currentThemeId, colors, onColorChange, theme }) {
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const colorRef = useRef(null);
  const links = [
    { to: '/about', label: 'About' },
    { to: '/courses', label: 'Courses' },
    { to: '/opportunities', label: 'Opportunities' },
    { to: '/contact', label: 'Contact' },
    { to: '/enroll', label: 'Enroll Now' }
  ];

  useEffect(() => {
    function handleOutside(e) {
      // 1. MODIFIED VALIDATION: Disables outside-clicking closure on mobile viewports
      const isMobileView = window.innerWidth <= 960;
      
      if (!isMobileView) {
        if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
          setIsMenuOpen(false);
        }
        if (isColorOpen && colorRef.current && !colorRef.current.contains(e.target)) {
          setIsColorOpen(false);
        }
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

    if (isMenuOpen) {
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
      <Link to="/" className="brand brand-link">
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

      <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-panel" ref={menuRef}>
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
        </div>
      </nav>

      {/* Unified right-side container tools column */}
      <div className="nav-tools">
        {/* The Hamburger Menu button sits cleanly on top */}
        <button
          className={`hamburger ${isMenuOpen ? 'open' : ''}`}
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((p) => !p)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* The Theme Spinning wheel is stacked directly underneath */}
        <button
          type="button"
          className={`color-toggle ${isColorOpen ? 'open' : ''}`}
          onClick={() => setIsColorOpen((prev) => !prev)}
          aria-expanded={isColorOpen}
          aria-label="Toggle color selector"
        >
          <span className="color-toggle-icon" />
        </button>

        <div ref={colorRef} className={`color-panel ${isColorOpen ? 'active' : ''}`}>
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
