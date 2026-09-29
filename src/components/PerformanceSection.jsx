import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PerformanceSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const gridRef = useRef(null);

  const [specs, setSpecs] = useState({
    hp: 0,
    sec: '0.0',
    torque: 0,
    topSpeed: 0
  });

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

      // Spec values animated count-up proxy
      const counterProxy = {
        hp: 0,
        sec: 0,
        torque: 0,
        topSpeed: 0
      };

      gsap.to(counterProxy, {
        hp: 620,
        sec: 3.2,
        torque: 780,
        topSpeed: 310,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        onUpdate: () => {
          setSpecs({
            hp: Math.round(counterProxy.hp),
            sec: counterProxy.sec.toFixed(1),
            torque: Math.round(counterProxy.torque),
            topSpeed: Math.round(counterProxy.topSpeed)
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="performance"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#08080a',
        padding: '14vh 6vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Background Subtle Gradient Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '40vw',
          height: '40vw',
          background: 'radial-gradient(circle, rgba(198, 40, 40, 0.035) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <div style={{ marginBottom: '8vh', maxWidth: '850px' }}>
        <div style={{ marginBottom: '1.2rem' }}>
          <span className="tech-label">TELEMETRY / 04</span>
        </div>
        <h2
          ref={headlineRef}
          className="font-display"
          style={{
            fontSize: 'clamp(2.2rem, 7.2vw, 6.8rem)',
            lineHeight: 0.94,
            color: '#f5f5f7',
            letterSpacing: '-0.04em',
            wordBreak: 'break-word'
          }}
        >
          NUMBERS<br />
          THAT MOVE.
        </h2>
      </div>

      {/* 4 Fictional Specs Editorial Grid with Thin Lines & Negative Space */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        className="performance-specs-grid"
      >
        {/* Spec 01: 620 HP */}
        <div
          style={{
            padding: '3.5rem 2rem 3.5rem 0',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '260px'
          }}
          className="spec-column"
        >
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.22em',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem'
              }}
            >
              01 // PEAK OUTPUT
            </div>
            <div
              className="font-display"
              style={{
                fontSize: 'clamp(3.8rem, 6.5vw, 6.8rem)',
                lineHeight: 0.88,
                color: '#f5f5f7',
                letterSpacing: '-0.04em'
              }}
            >
              {specs.hp}
            </div>
          </div>
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.85rem',
                letterSpacing: '0.18em',
                color: 'var(--accent-red)',
                fontWeight: 600,
                marginTop: '1rem'
              }}
            >
              HP
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                marginTop: '0.25rem'
              }}
            >
              DUAL-STAGE TURBOCHARGED
            </div>
          </div>
        </div>

        {/* Spec 02: 3.2 SEC 0–100 KM/H */}
        <div
          style={{
            padding: '3.5rem 2rem',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '260px'
          }}
          className="spec-column"
        >
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.22em',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem'
              }}
            >
              02 // ACCELERATION
            </div>
            <div
              className="font-display"
              style={{
                fontSize: 'clamp(3.8rem, 6.5vw, 6.8rem)',
                lineHeight: 0.88,
                color: '#f5f5f7',
                letterSpacing: '-0.04em'
              }}
            >
              {specs.sec}
            </div>
          </div>
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.85rem',
                letterSpacing: '0.18em',
                color: 'var(--accent-red)',
                fontWeight: 600,
                marginTop: '1rem'
              }}
            >
              SEC
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                marginTop: '0.25rem'
              }}
            >
              0–100 KM/H LAUNCH
            </div>
          </div>
        </div>

        {/* Spec 03: 780 NM TORQUE */}
        <div
          style={{
            padding: '3.5rem 2rem',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '260px'
          }}
          className="spec-column"
        >
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.22em',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem'
              }}
            >
              03 // TORQUE DENSITY
            </div>
            <div
              className="font-display"
              style={{
                fontSize: 'clamp(3.8rem, 6.5vw, 6.8rem)',
                lineHeight: 0.88,
                color: '#f5f5f7',
                letterSpacing: '-0.04em'
              }}
            >
              {specs.torque}
            </div>
          </div>
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.85rem',
                letterSpacing: '0.18em',
                color: 'var(--accent-red)',
                fontWeight: 600,
                marginTop: '1rem'
              }}
            >
              NM
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                marginTop: '0.25rem'
              }}
            >
              AVAILABLE AT 2,100 RPM
            </div>
          </div>
        </div>

        {/* Spec 04: 310 KM/H TOP SPEED */}
        <div
          style={{
            padding: '3.5rem 0 3.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '260px'
          }}
          className="spec-column last"
        >
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.22em',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem'
              }}
            >
              04 // VELOCITY
            </div>
            <div
              className="font-display"
              style={{
                fontSize: 'clamp(3.8rem, 6.5vw, 6.8rem)',
                lineHeight: 0.88,
                color: '#f5f5f7',
                letterSpacing: '-0.04em'
              }}
            >
              {specs.topSpeed}
            </div>
          </div>
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.85rem',
                letterSpacing: '0.18em',
                color: 'var(--accent-red)',
                fontWeight: 600,
                marginTop: '1rem'
              }}
            >
              KM/H
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                marginTop: '0.25rem'
              }}
            >
              AERODYNAMICALLY LIMITED
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .performance-specs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .spec-column {
            padding: 2.5rem 1.5rem !important;
          }
          .spec-column:nth-child(2) {
            border-right: none !important;
          }
          .spec-column:nth-child(3) {
            border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
            padding-left: 0 !important;
          }
          .spec-column:nth-child(4) {
            border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
            border-right: none !important;
          }
        }
        @media (max-width: 580px) {
          .performance-specs-grid {
            grid-template-columns: 1fr !important;
          }
          .spec-column {
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            padding: 2rem 0 !important;
          }
          .spec-column.last {
            border-bottom: none !important;
          }
        }
      `}</style>
    </section>
  );
}
