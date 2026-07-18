import React from 'react';

function Loader() {
  return (
    <div className="loader-screen" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: '#020617', color: '#ffffff' }}>
      <div className="loader-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', position: 'relative' }}>
        
        {/* Animated Spin Wrapper Container (Scaled up to 160px) */}
        <div style={{ position: 'relative', width: '160px', height: '160px', display: 'grid', placeItems: 'center' }}>
          
          {/* Outer Rotating Segment Indicator Ring */}
          <div className="loader-spinner" style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            border: '4px solid rgba(255, 255, 255, 0.05)', 
            borderTopColor: 'var(--accent-color, #2563eb)', 
            borderRadius: '50%'
          }} />

          {/* Central Branding Logo Image (Increased to 110px width and height) */}
          <img 
            src="/logo-3.png" 
            alt="CodeWeb logo mark" 
            style={{ 
              width: '110px', 
              height: '110px', 
              objectFit: 'contain',
              display: 'block',
              zIndex: '10',
              filter: 'none' 
            }} 
          />
        </div>

        {/* Loading text status row forced to solid, bright white */}
        <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600', letterSpacing: '0.04em', color: '#ffffff', opacity: '1' }}>
          CodeWeb is loading...
        </p>

      </div>
    </div>
  );
}

export default Loader;
