import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function EngineeringSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const copyRef = useRef(null);
  const imageRef = useRef(null);
  const linesRef = useRef([]);

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

      // Supporting copy reveal
      gsap.fromTo(
        copyRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Image subtle scale & parallax
      gsap.fromTo(
        imageRef.current,
        { scale: 1.08, opacity: 0.7 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Sequential line reveals
      linesRef.current.forEach((line, idx) => {
        if (!line) return;
        const lineText = line.querySelector('.line-title');
        const lineRule = line.querySelector('.line-rule');
        const lineSub = line.querySelector('.line-desc');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: line,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        });

        tl.fromTo(
          lineRule,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.8, ease: 'power3.out' }
        )
          .fromTo(
            lineText,
            { opacity: 0, x: -25 },
            { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' },
            '-=0.5'
          )
          .fromTo(
            lineSub,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.4'
          );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="engineering"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '120vh',
        backgroundColor: '#08080a',
        padding: '14vh 6vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Top Header Block */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto 8vh auto',
          width: '100%'
        }}
      >
        <div style={{ marginBottom: '1.2rem' }}>
          <span className="tech-label">PHILOSOPHY / 05</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            maxWidth: '1000px'
          }}
        >
          <h2
            ref={headlineRef}
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.8rem)',
              lineHeight: 0.94,
              color: '#f5f5f7',
              letterSpacing: '-0.04em'
            }}
          >
            ENGINEERED<br />
            AROUND MOTION.
          </h2>

          <p
            ref={copyRef}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              fontWeight: 300,
              maxWidth: '540px'
            }}
          >
            "A machine shaped by aerodynamics, weight distribution and an obsession with control."
          </p>
        </div>
      </div>

      {/* Editorial Split: Large Footage Still + Sequential Lines */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
          gap: '5rem',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
          alignItems: 'center'
        }}
        className="engineering-grid"
      >
        {/* Large still extracted from supplied video footage (clip1 high-speed mountain pass) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 3',
            overflow: 'hidden',
            backgroundColor: '#0c0d10'
          }}
        >
          <img
            ref={imageRef}
            src="/stills/clip1-passing.jpg"
            alt="Aerion Engineering dynamic motion on mountain pass"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.9) contrast(1.06)',
              display: 'block'
            }}
          />

          {/* Vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(8, 8, 10, 0.7) 0%, transparent 60%)',
              pointerEvents: 'none'
            }}
          />

          {/* Technical Corner Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              color: 'var(--text-secondary)',
              backgroundColor: 'rgba(8, 8, 10, 0.85)',
              padding: '0.4rem 0.8rem',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            DYNAMIC CHASSIS TELEMETRY // SECTOR 04
          </div>
        </div>

        {/* Sequential Lines Revealed on Scroll */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Line 01 */}
          <div ref={(el) => (linesRef.current[0] = el)} style={{ position: 'relative' }}>
            <div
              className="line-rule"
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                marginBottom: '1.5rem'
              }}
            />
            <div
              className="line-title font-display"
              style={{
                fontSize: 'clamp(1.5rem, 2.4vw, 2.2rem)',
                color: '#f5f5f7',
                letterSpacing: '-0.02em',
                marginBottom: '0.6rem',
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem'
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
                01 /
              </span>
              <span>LOW CENTRE OF GRAVITY</span>
            </div>
            <p
              className="line-desc"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.92rem',
                color: 'var(--text-muted)',
                lineHeight: 1.65,
                fontWeight: 300,
                maxWidth: '520px',
                paddingLeft: '2.5rem'
              }}
            >
              Engineered with a dry-sump structural powertrain set 140mm lower than conventional GT
              chassis, yielding immediate lateral weight transitions without body roll.
            </p>
          </div>

          {/* Line 02 */}
          <div ref={(el) => (linesRef.current[1] = el)} style={{ position: 'relative' }}>
            <div
              className="line-rule"
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                marginBottom: '1.5rem'
              }}
            />
            <div
              className="line-title font-display"
              style={{
                fontSize: 'clamp(1.5rem, 2.4vw, 2.2rem)',
                color: '#f5f5f7',
                letterSpacing: '-0.02em',
                marginBottom: '0.6rem',
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem'
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
                02 /
              </span>
              <span>ACTIVE AERODYNAMICS</span>
            </div>
            <p
              className="line-desc"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.92rem',
                color: 'var(--text-muted)',
                lineHeight: 1.65,
                fontWeight: 300,
                maxWidth: '520px',
                paddingLeft: '2.5rem'
              }}
            >
              Continuous airflow modulation via active underbody venturi flaps and multi-position
              rear aero element balances high-speed downforce with low-drag highway cruising.
            </p>
          </div>

          {/* Line 03 */}
          <div ref={(el) => (linesRef.current[2] = el)} style={{ position: 'relative' }}>
            <div
              className="line-rule"
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                marginBottom: '1.5rem'
              }}
            />
            <div
              className="line-title font-display"
              style={{
                fontSize: 'clamp(1.5rem, 2.4vw, 2.2rem)',
                color: '#f5f5f7',
                letterSpacing: '-0.02em',
                marginBottom: '0.6rem',
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem'
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
                03 /
              </span>
              <span>PRECISION CHASSIS</span>
            </div>
            <p
              className="line-desc"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.92rem',
                color: 'var(--text-muted)',
                lineHeight: 1.65,
                fontWeight: 300,
                maxWidth: '520px',
                paddingLeft: '2.5rem'
              }}
            >
              Double-wishbone pushrod suspension paired with active magnetorheological damping reads
              surface variations in under 2 milliseconds, maintaining an unbroken contact patch.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .engineering-grid {
            grid-template-columns: 1fr !important;
            gap: 3.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
