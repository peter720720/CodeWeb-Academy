import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  // Checks if the user's viewport screen is smaller than a mobile threshold width (640px)
  const isMobile = window.innerWidth <= 640;

  return (
    <footer className="site-footer" style={{ padding: '64px 24px 40px' }}>
      <div 
        className="footer-grid" 
        style={{ 
          display: 'grid', 
          // Dynamically sets to a single column on mobile, or 4 columns on desktop layouts
          gridTemplateColumns: isMobile ? '1fr' : '1.2fr repeat(3, 1fr)', 
          gap: isMobile ? '36px' : '40px', 
          maxWidth: '1440px', 
          margin: '0 auto', 
          width: '100%' 
        }}
      >
        
        {/* Column 1: Brand Info, Address, & Social Profiles */}
        <div className="footer-meta-column" style={{ maxWidth: isMobile ? '100%' : '360px' }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
            <img 
              src="/logo.png" 
              alt="CodeWeb logo" 
              style={{ height: '76px', width: 'auto', objectFit: 'contain', display: 'block' }} 
            />
          </Link>
          
          <p style={{ opacity: 0.85, fontSize: '0.92rem', marginBottom: '12px' }}>
            Empowering the next generation of digital builders with project-driven code pathways and elite technical mentorship workflows.
          </p>

          {/* Corporate Address Node */}
          <div style={{ marginTop: '18px', fontSize: '0.9rem', opacity: 0.8, display: 'grid', gap: '6px' }}>
            <span style={{ fontWeight: '700', color: 'var(--accent-color)' }}>ACADEMY HQ:</span>
            <span>102 Innovation Drive, Tech Hub Core</span>
            <span>Yaba, Lagos, Nigeria</span>
          </div>

          {/* Social Media Link Array Icons forced side-by-side on mobile rows */}
          <div className="footer-social-row" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
            </a>

            {/* Twitter / X */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Twitter">
              <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>

            {/* TikTok */}
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="TikTok">
              <svg viewBox="0 0 24 24"><path d="M12.525.02c1.31.01 2.61.1 3.84.44V4.1c-1.14-.3-2.33-.35-3.47-.16v11.95c-.01 1.74-.75 3.32-2.13 4.22-1.92 1.25-4.52.92-6.04-.77-1.57-1.74-1.49-4.5.21-6.14 1.41-1.35 3.51-1.66 5.25-.86v-3.9a8.143 8.143 0 0 0-4.83.6c-3.15 1.29-5.18 4.54-4.81 7.97.43 3.99 3.8 7.15 7.82 7.03 3.95-.12 7.19-3.23 7.33-7.2V6.63A8.447 8.447 0 0 0 22 9.42V5.55a4.444 4.444 0 0 1-4.14-3.12l-.04-1.39h-5.29z"/></svg>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>

            {/* Upwork */}
            <a href="https://upwork.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Upwork">
              <svg viewBox="0 0 24 24"><path d="M18.56 1H5.44C2.99 1 1 2.99 1 5.44v13.12C1 21.01 2.99 23 5.44 23h13.12c2.45 0 4.44-1.99 4.44-4.44V5.44C23 2.99 21.01 1 18.56 1zm-4.3 14.28c-.85.85-1.9 1.4-3.11 1.63v-3.52c1.32-.2 2.4-.87 3.11-1.63.71-.76 1.11-1.78 1.11-2.92a4.11 4.11 0 0 0-4.11-4.11c-2.27 0-4.11 1.84-4.11 4.11v4.83H4.78V9.16c0-3.5 2.85-6.35 6.35-6.35 3.5 0 6.35 2.85 6.35 6.35a6.29 6.29 0 0 1-3.22 5.56z"/></svg>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
          </div>
        </div>

        {/* Column 2: Academic Pathways Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 className="footer-heading" style={{ fontSize: '1rem', marginBottom: '4px', letterSpacing: '0.05em' }}>ACADEMICS</h4>
          <Link to="/courses">Frontend Engineering</Link>
          <Link to="/courses">Backend Systems</Link>
          <Link to="/courses">Full-Stack Development</Link>
          <Link to="/courses">Cybersecurity Fundamentals</Link>
        </div>

        {/* Column 3: Corporate Portals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 className="footer-heading" style={{ fontSize: '1rem', marginBottom: '4px', letterSpacing: '0.05em' }}>RESOURCES</h4>
          <Link to="/opportunities">Career Opportunities</Link>
          <Link to="/about">About Academy</Link>
          <Link to="/enroll">Student Dashboard</Link>
          <a href="#privacy">Privacy Commitments</a>
        </div>

        {/* Column 4: Contact Connect Help desk */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 className="footer-heading" style={{ fontSize: '1rem', marginBottom: '4px', letterSpacing: '0.05em' }}>SUPPORT</h4>
          <p style={{ margin: '0', fontSize: '0.9rem' }}>Questions or Admissions support?</p>
          <a href="mailto:admissions@codeweb.edu" style={{ fontWeight: '700', color: 'var(--accent-color)' }}>admissions@codeweb.edu</a>
          <p style={{ margin: '0', fontSize: '0.85rem', opacity: 0.7 }}>Response timeframe: 24hrs</p>
        </div>

      </div>

      {/* Flat sub-base legal disclaimer banner row */}
      <div style={{ marginTop: '48px', paddingTop: '20px', borderTop: '1px solid var(--panel-border, rgba(255,255,255,0.08))', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', fontSize: '0.85rem', opacity: 0.7, maxWidth: '1440px', margin: '48px auto 0' }}>
        <span>&copy; {new Date().getFullYear()} CodeWeb Academy Group. All global rights reserved.</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#terms">Terms of Training</a>
          <a href="#cookies">Cookie Preferences</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
