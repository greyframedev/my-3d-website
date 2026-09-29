import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';


export default function Navbar({ onOpenMenu, isMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        padding: scrolled ? '1.1rem 2.8rem' : '1.8rem 2.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: scrolled ? 'rgba(8, 8, 10, 0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid transparent'
      }}
    >
      {/* Brand Mark (Left) */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.75rem',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#f5f5f7'
          }}
        >
          AERION
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.24em',
            color: 'var(--text-muted)',
            display: 'none',
            '@media (minWidth: 768px)': { display: 'inline' }
          }}
          className="desktop-only-tag"
        >
          [VALENCE GT]
        </span>
      </div>

      {/* Nav Links (Center/Right) */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem'
        }}
      >
        <div
          className="nav-links-desktop"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.2rem'
          }}
        >
          <button
            onClick={() => scrollTo('machine')}
            className="nav-item"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              color: 'var(--text-secondary)',
              transition: 'color 0.25s'
            }}
          >
            MODELS
          </button>
          <button
            onClick={() => scrollTo('performance')}
            className="nav-item"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              color: 'var(--text-secondary)',
              transition: 'color 0.25s'
            }}
          >
            PERFORMANCE
          </button>
          <button
            onClick={() => scrollTo('design')}
            className="nav-item"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              color: 'var(--text-secondary)',
              transition: 'color 0.25s'
            }}
          >
            DESIGN
          </button>
          <button
            onClick={() => scrollTo('engineering')}
            className="nav-item"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              color: 'var(--text-secondary)',
              transition: 'color 0.25s'
            }}
          >
            TECHNOLOGY
          </button>
        </div>

        {/* Audio Ambient Soundscape Toggle */}
       

        {/* Menu Drawer Toggle */}
        <button
          onClick={onOpenMenu}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            color: '#f5f5f7',
            padding: '0.3rem 0',
            transition: 'color 0.2s'
          }}
        >
          {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
          <span>MENU</span>
        </button>
      </nav>

      <style>{`
        .nav-item:hover {
          color: #f5f5f7 !important;
        }
        @media (max-width: 860px) {
          .nav-links-desktop {
            display: none !important;
          }
          header {
            padding: 1.2rem 1.5rem !important;
          }
          .sound-toggle-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
