import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DesignSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const imageContainerRef = useRef(null);
  const calloutsRef = useRef([]);
  const [activeCallout, setActiveCallout] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline reveal
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Car image subtle scale-in
      gsap.fromTo(
        imageContainerRef.current,
        { scale: 0.95, opacity: 0.7 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: imageContainerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Callouts staggered reveal
      calloutsRef.current.forEach((el, index) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: index * 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imageContainerRef.current,
              start: 'top 65%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="design"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '120vh',
        backgroundColor: '#08080a',
        padding: '12vh 6vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Background Ambience */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(198, 40, 40, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Section Header */}
      <div style={{ marginBottom: '5vh', maxWidth: '900px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <span className="tech-label">DESIGN ARCHITECTURE / 03</span>
        </div>
        <h2
          ref={headlineRef}
          className="font-display"
          style={{
            fontSize: 'clamp(2.8rem, 6.8vw, 6.4rem)',
            lineHeight: 0.95,
            color: '#f5f5f7',
            letterSpacing: '-0.04em'
          }}
        >
          EVERY LINE<br />
          HAS A PURPOSE.
        </h2>
      </div>

      {/* Main Composition: Extracted Footage Still + Interactive Precision Callouts */}
      <div
        ref={imageContainerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          borderRadius: '2px',
          overflow: 'hidden'
        }}
      >
        {/* Still Frame from clip2 footage */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            backgroundColor: '#0d0e12',
            overflow: 'hidden'
          }}
        >
          <img
            src="/stills/clip2-beauty.jpg"
            alt="Aerion Valence GT Sculptural Architecture"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.92) contrast(1.05)',
              display: 'block'
            }}
          />

          {/* Vignette Gradients */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at center, transparent 40%, rgba(8, 8, 10, 0.7) 100%)',
              pointerEvents: 'none'
            }}
          />

          {/* SVG Precision Technical Lines connecting points to callout areas */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 3
            }}
          >
            {/* 01 Splitter Line: Car lower front (approx 24% x, 74% y) to Callout 1 (18% x, 88% y) */}
            <circle
              cx="24%"
              cy="74%"
              r="4"
              fill={activeCallout === 1 ? '#c62828' : '#f5f5f7'}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
            <circle
              cx="24%"
              cy="74%"
              r={activeCallout === 1 ? '10' : '7'}
              fill="none"
              stroke={activeCallout === 1 ? '#c62828' : 'rgba(255,255,255,0.2)'}
              strokeWidth="1"
            />
            <line
              x1="24%"
              y1="74%"
              x2="18%"
              y2="86%"
              stroke={activeCallout === 1 ? '#c62828' : 'rgba(255, 255, 255, 0.25)'}
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* 02 Headlight Line: Car optic cluster (approx 32% x, 56% y) to Callout 2 (38% x, 28% y) */}
            <circle
              cx="32%"
              cy="56%"
              r="4"
              fill={activeCallout === 2 ? '#c62828' : '#f5f5f7'}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
            <circle
              cx="32%"
              cy="56%"
              r={activeCallout === 2 ? '10' : '7'}
              fill="none"
              stroke={activeCallout === 2 ? '#c62828' : 'rgba(255,255,255,0.2)'}
              strokeWidth="1"
            />
            <line
              x1="32%"
              y1="56%"
              x2="45%"
              y2="28%"
              stroke={activeCallout === 2 ? '#c62828' : 'rgba(255, 255, 255, 0.25)'}
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* 03 Balance / Roofline Line: Car center roof / greenhouse (approx 62% x, 40% y) to Callout 3 (78% x, 22% y) */}
            <circle
              cx="62%"
              cy="40%"
              r="4"
              fill={activeCallout === 3 ? '#c62828' : '#f5f5f7'}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
            <circle
              cx="62%"
              cy="40%"
              r={activeCallout === 3 ? '10' : '7'}
              fill="none"
              stroke={activeCallout === 3 ? '#c62828' : 'rgba(255,255,255,0.2)'}
              strokeWidth="1"
            />
            <line
              x1="62%"
              y1="40%"
              x2="78%"
              y2="26%"
              stroke={activeCallout === 3 ? '#c62828' : 'rgba(255, 255, 255, 0.25)'}
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
      </div>

      {/* The 3 Minimal Technical Callouts (Editorial layout, No Cards, Thin Lines) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3.5rem',
          maxWidth: '1440px',
          margin: '4rem auto 0 auto',
          width: '100%'
        }}
      >
        {/* Callout 01 */}
        <div
          ref={(el) => (calloutsRef.current[0] = el)}
          onMouseEnter={() => setActiveCallout(1)}
          onMouseLeave={() => setActiveCallout(null)}
          style={{
            position: 'relative',
            paddingTop: '1.2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            transition: 'border-color 0.3s'
          }}
          className="design-callout-item"
        >
          <div
            className="font-mono"
            style={{
              fontSize: '0.7rem',
              color: 'var(--accent-red)',
              letterSpacing: '0.22em',
              marginBottom: '0.5rem'
            }}
          >
            01
          </div>
          <h3
            className="font-display"
            style={{
              fontSize: '1.8rem',
              color: '#f5f5f7',
              letterSpacing: '-0.02em',
              marginBottom: '0.4rem'
            }}
          >
            AERODYNAMICS
          </h3>
          <p
            className="font-mono"
            style={{
              fontSize: '0.76rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem'
            }}
          >
            SCULPTED FOR SPEED
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              fontWeight: 300
            }}
          >
            Every curve and duct directs turbulent air around the chassis, converting high-velocity
            airflow into functional vertical load without drag penalty.
          </p>
        </div>

        {/* Callout 02 */}
        <div
          ref={(el) => (calloutsRef.current[1] = el)}
          onMouseEnter={() => setActiveCallout(2)}
          onMouseLeave={() => setActiveCallout(null)}
          style={{
            position: 'relative',
            paddingTop: '1.2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            transition: 'border-color 0.3s'
          }}
          className="design-callout-item"
        >
          <div
            className="font-mono"
            style={{
              fontSize: '0.7rem',
              color: 'var(--accent-red)',
              letterSpacing: '0.22em',
              marginBottom: '0.5rem'
            }}
          >
            02
          </div>
          <h3
            className="font-display"
            style={{
              fontSize: '1.8rem',
              color: '#f5f5f7',
              letterSpacing: '-0.02em',
              marginBottom: '0.4rem'
            }}
          >
            LIGHT
          </h3>
          <p
            className="font-mono"
            style={{
              fontSize: '0.76rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem'
            }}
          >
            PRECISION IN EVERY DETAIL
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              fontWeight: 300
            }}
          >
            Precision-milled optical projectors integrate dynamic matrix beams that anticipate
            cornering vectors using real-time road topology inputs.
          </p>
        </div>

        {/* Callout 03 */}
        <div
          ref={(el) => (calloutsRef.current[2] = el)}
          onMouseEnter={() => setActiveCallout(3)}
          onMouseLeave={() => setActiveCallout(null)}
          style={{
            position: 'relative',
            paddingTop: '1.2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            transition: 'border-color 0.3s'
          }}
          className="design-callout-item"
        >
          <div
            className="font-mono"
            style={{
              fontSize: '0.7rem',
              color: 'var(--accent-red)',
              letterSpacing: '0.22em',
              marginBottom: '0.5rem'
            }}
          >
            03
          </div>
          <h3
            className="font-display"
            style={{
              fontSize: '1.8rem',
              color: '#f5f5f7',
              letterSpacing: '-0.02em',
              marginBottom: '0.4rem'
            }}
          >
            BALANCE
          </h3>
          <p
            className="font-mono"
            style={{
              fontSize: '0.76rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem'
            }}
          >
            DESIGNED AROUND MOTION
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              fontWeight: 300
            }}
          >
            A mid-chassis low polar moment of inertia creates razor-sharp response through the tightest
            alpine hairpins and high-speed sweepers.
          </p>
        </div>
      </div>

      <style>{`
        .design-callout-item:hover {
          border-top-color: #f5f5f7 !important;
        }
      `}</style>
    </section>
  );
}
