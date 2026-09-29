import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronUp, X, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FinalSection() {
  const sectionRef = useRef(null);
  const bgImageRef = useRef(null);
  const contentRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax zoom on the sunset vista still
      gsap.fromTo(
        bgImageRef.current,
        { scale: 1.15, y: -20 },
        {
          scale: 1,
          y: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      );

      // Content reveal
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <section
        id="final"
        ref={sectionRef}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#08080a',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* Full-width Background Image (Strongest frame: clip2 sunset alpine curve) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none'
          }}
        >
          <img
            ref={bgImageRef}
            src="/stills/clip2-sunset.jpg"
            alt="Aerion Valence GT Alpine Sunset"
            style={{
              width: '100%',
              height: '115%',
              objectFit: 'cover',
              filter: 'brightness(0.65) contrast(1.15) saturate(0.9)',
              willChange: 'transform'
            }}
          />
          {/* Subtle gradient vignette to deepen text readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at center, rgba(8,8,10,0.3) 0%, rgba(8,8,10,0.88) 100%)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '35vh',
              background: 'linear-gradient(to top, rgba(8,8,10,1) 0%, transparent 100%)'
            }}
          />
        </div>

        {/* Top spacer */}
        <div style={{ height: '10vh' }} />

        {/* Center Editorial Typography */}
        <div
          ref={contentRef}
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 4vw',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="tech-label">CLIMAX // 06</span>
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2.2rem, 5.6vw, 5.4rem)',
              lineHeight: 0.95,
              color: '#f5f5f7',
              letterSpacing: '-0.035em',
              marginBottom: '1.8rem',
              whiteSpace: 'nowrap'
            }}
          >
            PURE<br />
            PERFORMANCE.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              fontWeight: 300,
              maxWidth: '460px',
              marginBottom: '3rem'
            }}
          >
            "Nothing unnecessary.<br />
            Nothing accidental."
          </p>

          {/* Minimal CTA with Sophisticated Hover Animation */}
          <button
            onClick={() => setModalOpen(true)}
            className="cta-button"
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.2rem',
              padding: '1.2rem 2.4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              letterSpacing: '0.24em',
              color: '#f5f5f7',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden'
            }}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>EXPLORE THE MACHINE</span>
            <span className="cta-arrow" style={{ position: 'relative', zIndex: 2, display: 'inline-flex', transition: 'transform 0.3s' }}>
              &rarr;
            </span>
            <div className="cta-hover-fill" />
          </button>
        </div>

        {/* Editorial Footer / Colophon */}
        <footer
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '3rem 6vw',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span
              className="font-mono"
              style={{ fontSize: '0.72rem', letterSpacing: '0.22em', color: '#f5f5f7' }}
            >
              AERION AUTOMOBILI
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.12em'
              }}
            >
              EUROPEAN PERFORMANCE VEHICLE CONCEPT // ALL ASSETS AUTHENTIC
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em'
              }}
            >
              &copy; {new Date().getFullYear()} AERION CONCEPTS
            </span>
            <button
              onClick={scrollToTop}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                color: 'var(--text-secondary)',
                padding: '0.4rem 0.6rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.25s'
              }}
              className="back-to-top-btn"
            >
              <ChevronUp size={14} />
              <span>TOP</span>
            </button>
          </div>
        </footer>
      </section>

      {/* Interactive Dossier Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(8, 8, 10, 0.94)',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '820px',
              backgroundColor: '#0d0e12',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '3rem',
              color: '#f5f5f7'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.8rem',
                right: '1.8rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: '1.5rem' }}>
              <span className="tech-label">TECHNICAL DOSSIER // CONFIDENTIAL</span>
            </div>

            <h3
              className="font-display"
              style={{
                fontSize: '2.4rem',
                letterSpacing: '-0.03em',
                marginBottom: '1.8rem'
              }}
            >
              AERION VALENCE GT
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '1.8rem'
              }}
            >
              <div>
                <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.16em' }}>
                  CHASSIS ARCHITECTURE
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500, marginTop: '0.3rem' }}>
                  Carbon Composite Monocoque with Aluminum Subframes
                </div>
              </div>

              <div>
                <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.16em' }}>
                  CURB WEIGHT & DISTRIBUTION
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500, marginTop: '0.3rem' }}>
                  1,420 kg &middot; 48% Front / 52% Rear
                </div>
              </div>

              <div>
                <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.16em' }}>
                  TRANSMISSION
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500, marginTop: '0.3rem' }}>
                  8-Speed Dual-Clutch Electro-Hydraulic Paddle Shift
                </div>
              </div>

              <div>
                <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.16em' }}>
                  AERODYNAMIC COEFFICIENT
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500, marginTop: '0.3rem' }}>
                  0.28 Cd (Active Variable Ground Effect)
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '2.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                PRODUCTION ALLOCATION // 250 UNITS
              </span>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  padding: '0.6rem 1.4rem',
                  backgroundColor: '#f5f5f7',
                  color: '#08080a',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.16em',
                  fontWeight: 600
                }}
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cta-button {
          position: relative;
        }
        .cta-hover-fill {
          position: absolute;
          inset: 0;
          background: #f5f5f7;
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
        }
        .cta-button:hover {
          color: #08080a !important;
          border-color: #f5f5f7 !important;
        }
        .cta-button:hover .cta-hover-fill {
          transform: translateY(0);
        }
        .cta-button:hover .cta-arrow {
          transform: translateX(6px);
        }
        .back-to-top-btn:hover {
          color: #f5f5f7 !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>
    </>
  );
}
