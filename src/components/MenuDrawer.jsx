import React from 'react';
import { X, ArrowUpRight } from 'lucide-react';

export default function MenuDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  const navigateTo = (id) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        backgroundColor: 'rgba(8, 8, 10, 0.96)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem 6vw',
        animation: 'fadeIn 0.35s ease-out'
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="font-display" style={{ fontSize: '1.4rem', color: '#f5f5f7' }}>
            AERION
          </span>
          <span className="tech-label">INDEX / SYSTEM DOSSIER</span>
        </div>

        <button
          onClick={onClose}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.2em',
            color: '#f5f5f7',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
          <span>CLOSE</span>
        </button>
      </div>

      {/* Main Navigation List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.8rem',
          maxWidth: '800px',
          margin: 'auto 0'
        }}
      >
        {[
          { num: '01', title: 'CINEMATIC SCENE 01 — DYNAMIC MOTION', target: 'hero' },
          { num: '02', title: 'CINEMATIC SCENE 02 — THE MACHINE', target: 'machine' },
          { num: '03', title: 'DESIGN ARCHITECTURE', target: 'design' },
          { num: '04', title: 'PERFORMANCE TELEMETRY', target: 'performance' },
          { num: '05', title: 'ENGINEERING PRINCIPLES', target: 'engineering' },
          { num: '06', title: 'FINAL CLIMAX & DOSSIER', target: 'final' }
        ].map((item) => (
          <div
            key={item.num}
            onClick={() => navigateTo(item.target)}
            className="drawer-nav-item"
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '2rem',
              cursor: 'pointer',
              transition: 'transform 0.25s'
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: '0.85rem',
                color: 'var(--accent-red)',
                letterSpacing: '0.18em'
              }}
            >
              {item.num} //
            </span>
            <span
              className="font-display drawer-title"
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
                color: '#9a9aa0',
                letterSpacing: '-0.03em',
                transition: 'color 0.25s'
              }}
            >
              {item.title}
            </span>
            <ArrowUpRight size={20} className="drawer-arrow" style={{ opacity: 0, transition: 'opacity 0.25s, transform 0.25s' }} />
          </div>
        ))}
      </div>

      {/* Bottom Technical Footnote */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.8rem'
        }}
      >
        <span
          className="font-mono"
          style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}
        >
          AERION AUTOMOBILI &middot; EUROPEAN PERFORMANCE MARQUE
        </span>
        <span
          className="font-mono"
          style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}
        >
          SCROLL TO MODULATE CINEMATIC PLAYBACK
        </span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .drawer-nav-item:hover {
          transform: translateX(12px);
        }
        .drawer-nav-item:hover .drawer-title {
          color: #f5f5f7 !important;
        }
        .drawer-nav-item:hover .drawer-arrow {
          opacity: 1 !important;
          transform: translate(4px, -4px);
        }
      `}</style>
    </div>
  );
}
