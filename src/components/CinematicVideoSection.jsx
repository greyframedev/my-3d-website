import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { audioEngine } from './AudioEngine';

gsap.registerPlugin(ScrollTrigger);

export default function CinematicVideoSection({ video1Ref, video2Ref }) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  // Section 01 elements
  const heroTextRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const transitionCurtainRef = useRef(null);

  // Section 02 elements
  const scene2LabelRef = useRef(null);
  const scene2HeadlineRef = useRef(null);
  const techMarkersRef = useRef(null);

  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2 || !containerRef.current || !stageRef.current) return;

    let ctx = gsap.context(() => {
           // iOS Safari: videos must be muted and "unlocked" by play() before they can be scrubbed
      const videos = [v1, v2];
      videos.forEach((v) => {
        v.muted = true;
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', '');
        v.addEventListener('loadedmetadata', () => ScrollTrigger.refresh());
      });

      const unlockVideos = () => {
        videos.forEach((v) => {
          const p = v.play();
          if (p && p.then) {
            p.then(() => v.pause()).catch(() => {});
          }
        });
      };
      unlockVideos(); // try right away
      window.addEventListener('touchstart', unlockVideos, { once: true, passive: true });
      window.addEventListener('click', unlockVideos, { once: true }); 

      const v1Proxy = { time: 0 };
      const v2Proxy = { time: 0 };

      // Helper function to safely seek without flooding decoder
      let isSeeking1 = false;
      let pendingTime1 = null;
      const onSeeked1 = () => {
        isSeeking1 = false;
        if (pendingTime1 !== null && v1) {
          const t = pendingTime1;
          pendingTime1 = null;
          v1.currentTime = t;
        }
      };
      v1.addEventListener('seeked', onSeeked1);

      function updateVideo1(targetTime) {
        if (!v1 || !v1.duration) return;
        const dur = v1.duration;
        const clamped = Math.max(0, Math.min(targetTime, dur - 0.05));
        if (Math.abs(v1.currentTime - clamped) < 0.02) return;

        if (!isSeeking1) {
          isSeeking1 = true;
          v1.currentTime = clamped;
        } else {
          pendingTime1 = clamped;
        }
      }

      let isSeeking2 = false;
      let pendingTime2 = null;
      const onSeeked2 = () => {
        isSeeking2 = false;
        if (pendingTime2 !== null && v2) {
          const t = pendingTime2;
          pendingTime2 = null;
          v2.currentTime = t;
        }
      };
      v2.addEventListener('seeked', onSeeked2);

      function updateVideo2(targetTime) {
        if (!v2 || !v2.duration) return;
        const dur = v2.duration;
        const clamped = Math.max(0, Math.min(targetTime, dur - 0.05));
        if (Math.abs(v2.currentTime - clamped) < 0.02) return;

        if (!isSeeking2) {
          isSeeking2 = true;
          v2.currentTime = clamped;
        } else {
          pendingTime2 = clamped;
        }
      }

      // Initial visual states
      gsap.set(v1, { opacity: 1, scale: 1 });
      gsap.set(v2, { opacity: 0, scale: 1.05 });
      gsap.set(heroTextRef.current, { opacity: 1, y: 0 });
      gsap.set(scrollIndicatorRef.current, { opacity: 1 });
      gsap.set(scene2LabelRef.current, { opacity: 0, y: 20 });
      gsap.set(scene2HeadlineRef.current, { opacity: 0, y: 30 });
      gsap.set(techMarkersRef.current, { opacity: 0 });

      // Master scrubbed timeline across the pinned viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: stageRef.current,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Modulate ambient soundscape with scroll velocity
            const speed = Math.abs(self.getVelocity()) / 1000;
            audioEngine.modulate(speed);
          }
        }
      });

      /* ====================================================
         PHASE 1: SECTION 01 — HERO / CLIP 1 (0.00 -> 0.46)
         ==================================================== */
      // Scrub Video 1
      tl.to(
        v1Proxy,
        {
          time: () => (v1.duration ? v1.duration : 10),
          ease: 'none',
          duration: 0.46,
          onUpdate: () => updateVideo1(v1Proxy.time)
        },
        0
      );

      // Hero scroll indicator fades out immediately upon scroll start
      tl.to(
        scrollIndicatorRef.current,
        {
          opacity: 0,
          y: 15,
          duration: 0.06,
          ease: 'power2.out'
        },
        0.01
      );

      // Hero Typography ("BUILT TO MOVE.") moves subtly upward and fades away
      tl.to(
        heroTextRef.current,
        {
          opacity: 0,
          y: -50,
          duration: 0.16,
          ease: 'power2.inOut'
        },
        0.18
      );

      /* ====================================================
         PHASE 2: CINEMATIC EDIT TRANSITION (0.42 -> 0.54)
         Clip 1 scales subtly and darkens/fades.
         Clip 2 emerges beneath/through it (scales down).
         ==================================================== */
      // Clip 1 subtle scale and dissolve
      tl.to(
        v1,
        {
          scale: 1.05,
          opacity: 0,
          duration: 0.1,
          ease: 'power2.inOut'
        },
        0.44
      );

      // Transition vignette pulse
      tl.fromTo(
        transitionCurtainRef.current,
        { opacity: 0 },
        { opacity: 0.55, duration: 0.06, ease: 'power2.in', yoyo: true, repeat: 1 },
        0.45
      );

      // Clip 2 emerges
      tl.to(
        v2,
        {
          opacity: 1,
          scale: 1,
          duration: 0.1,
          ease: 'power2.inOut'
        },
        0.46
      );

      /* ====================================================
         PHASE 3: SECTION 02 — CLIP 2 (0.48 -> 1.00)
         ==================================================== */
      // Scrub Video 2
      tl.to(
        v2Proxy,
        {
          time: () => (v2.duration ? v2.duration : 10),
          ease: 'none',
          duration: 0.52,
          onUpdate: () => updateVideo2(v2Proxy.time)
        },
        0.48
      );

      // Section 2 small label: "THE MACHINE / 02"
      tl.to(
        scene2LabelRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.06,
          ease: 'power2.out'
        },
        0.49
      );

      // Section 2 Main Headline: "FORM FOLLOWS FORCE."
      tl.to(
        scene2HeadlineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.08,
          ease: 'power2.out'
        },
        0.51
      );

      // Headline holds, then gently moves up and fades as wide mountain view reveals
      tl.to(
        scene2HeadlineRef.current,
        {
          opacity: 0,
          y: -40,
          duration: 0.09,
          ease: 'power2.in'
        },
        0.69
      );

      tl.to(
        scene2LabelRef.current,
        {
          opacity: 0,
          y: -20,
          duration: 0.08,
          ease: 'power2.in'
        },
        0.71
      );

      // Technical markers reveal sequentially: PRECISION, AERODYNAMICS, CONTROL
      tl.to(
        techMarkersRef.current,
        {
          opacity: 1,
          duration: 0.08,
          ease: 'power2.out'
        },
        0.78
      );

      // Markers stay visible through the golden sunset scene and fade as we exit
      tl.to(
        techMarkersRef.current,
        {
          opacity: 0,
          y: -20,
          duration: 0.06,
          ease: 'power2.in'
        },
        0.95
      );

      return () => {
        v1.removeEventListener('seeked', onSeeked1);
        v2.removeEventListener('seeked', onSeeked2);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [video1Ref, video2Ref]);

  return (
    <section
      id="hero"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '650vh', // 350vh for Scene 1 + transition + 300vh for Scene 2
        backgroundColor: '#08080a'
      }}
    >
      {/* Target anchor for Scene 02 jump */}
      <div id="machine" style={{ position: 'absolute', top: '48%', left: 0, height: '1px' }} />

      {/* Pinned 100vh Viewport Stage */}
      <div
        ref={stageRef}
        className="video-canvas-stage"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        {/* VIDEO 1: clip1.mp4 (HERO / SCENE 01) */}
        <video
          ref={video1Ref}
          src="/videos/clip1.mp4"
          poster="/stills/clip1-start.jpg"
          muted
          loop
          playsInline
          preload="auto"
          className="video-element"
          style={{ zIndex: 1 }}
        />

        {/* VIDEO 2: clip2.mp4 (THE MACHINE / SCENE 02) */}
        <video
          ref={video2Ref}
          src="/videos/clip2.mp4"
          poster="/stills/clip2-headlight.jpg"
          muted
          loop
          playsInline
          preload="auto"
          className="video-element"
          style={{ zIndex: 2 }}
        />

        {/* Transition Shutter Curtain */}
        <div
          ref={transitionCurtainRef}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#08080a',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 3
          }}
        />

        {/* Cinematic Vignettes */}
        <div className="cinematic-vignette" style={{ zIndex: 4 }} />
        <div className="cinematic-overlay-bottom" style={{ zIndex: 4 }} />
        <div className="cinematic-overlay-top" style={{ zIndex: 4 }} />

        {/* =========================================================
            SECTION 01: HERO OVERLAY TYPOGRAPHY
            ========================================================= */}
        <div
          ref={heroTextRef}
          style={{
            position: 'absolute',
            bottom: '8vh',
            left: '6vw',
            maxWidth: '750px',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          {/* Small Label: PERFORMANCE / 01 */}
          <div style={{ marginBottom: '1.2rem' }}>
            <span className="tech-label">PERFORMANCE / 01</span>
          </div>

          {/* Main Headline: BUILT TO MOVE. */}
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.6rem, 8.2vw, 8rem)',
              lineHeight: 0.92,
              color: '#f5f5f7',
              marginBottom: '1.8rem',
              letterSpacing: '-0.045em',
              wordBreak: 'break-word'
            }}
          >
            BUILT<br />
            TO MOVE.
          </h1>

          {/* Small supporting text */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
              color: 'var(--text-secondary)',
              maxWidth: '460px',
              lineHeight: 1.6,
              fontWeight: 300,
              letterSpacing: '0.01em'
            }}
          >
            An uncompromising study in motion, precision and form.
          </p>
        </div>

        {/* Bottom indicator: SCROLL TO EXPLORE ↓ */}
        <div
          ref={scrollIndicatorRef}
          style={{
            position: 'absolute',
            bottom: '4vh',
            right: '6vw',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.4rem',
            pointerEvents: 'none'
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.22em',
              color: 'var(--text-secondary)'
            }}
          >
            SCROLL TO EXPLORE &darr;
          </span>
          <div
            style={{
              width: '45px',
              height: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.25)'
            }}
          />
        </div>

        {/* =========================================================
            SECTION 02: CLIP 2 TYPOGRAPHY OVERLAY
            ========================================================= */}
        {/* Small Label: THE MACHINE / 02 */}
        <div
          ref={scene2LabelRef}
          style={{
            position: 'absolute',
            top: '15vh',
            left: '6vw',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <span className="tech-label">THE MACHINE / 02</span>
        </div>

        {/* Main Headline: FORM FOLLOWS FORCE. */}
        <div
          ref={scene2HeadlineRef}
          style={{
            position: 'absolute',
            top: '22vh',
            left: '6vw',
            maxWidth: '900px',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2.4rem, 7.5vw, 7.5rem)',
              lineHeight: 0.94,
              color: '#f5f5f7',
              letterSpacing: '-0.04em',
              wordBreak: 'break-word'
            }}
          >
            FORM<br />
            FOLLOWS<br />
            FORCE.
          </h2>
        </div>

        {/* Sequential Technical Markers: PRECISION, AERODYNAMICS, CONTROL */}
        <div
          ref={techMarkersRef}
          style={{
            position: 'absolute',
            bottom: '7vh',
            left: '6vw',
            right: '6vw',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '2rem',
            flexWrap: 'wrap',
            pointerEvents: 'none'
          }}
        >
          {/* 01 PRECISION */}
          <div style={{ flex: '1 1 200px', maxWidth: '280px' }}>
            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                marginBottom: '0.8rem'
              }}
            />
            <div
              className="font-mono"
              style={{
                fontSize: '0.62rem',
                color: 'var(--accent-red)',
                letterSpacing: '0.2em',
                marginBottom: '0.2rem'
              }}
            >
              01 // MATRIX
            </div>
            <h4
              className="font-display"
              style={{
                fontSize: '1.4rem',
                letterSpacing: '-0.02em',
                color: '#f5f5f7',
                marginBottom: '0.3rem'
              }}
            >
              PRECISION
            </h4>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                color: 'var(--text-secondary)',
                lineHeight: 1.4
              }}
            >
              Quad-LED matrix architecture sculpted for zero light scatter.
            </p>
          </div>

          {/* 02 AERODYNAMICS */}
          <div style={{ flex: '1 1 200px', maxWidth: '280px' }}>
            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                marginBottom: '0.8rem'
              }}
            />
            <div
              className="font-mono"
              style={{
                fontSize: '0.62rem',
                color: 'var(--accent-red)',
                letterSpacing: '0.2em',
                marginBottom: '0.2rem'
              }}
            >
              02 // AIRFLOW
            </div>
            <h4
              className="font-display"
              style={{
                fontSize: '1.4rem',
                letterSpacing: '-0.02em',
                color: '#f5f5f7',
                marginBottom: '0.3rem'
              }}
            >
              AERODYNAMICS
            </h4>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                color: 'var(--text-secondary)',
                lineHeight: 1.4
              }}
            >
              Negative-pressure underbody channels delivering 380 kg downforce.
            </p>
          </div>

          {/* 03 CONTROL */}
          <div style={{ flex: '1 1 200px', maxWidth: '280px' }}>
            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                marginBottom: '0.8rem'
              }}
            />
            <div
              className="font-mono"
              style={{
                fontSize: '0.62rem',
                color: 'var(--accent-red)',
                letterSpacing: '0.2em',
                marginBottom: '0.2rem'
              }}
            >
              03 // CHASSIS
            </div>
            <h4
              className="font-display"
              style={{
                fontSize: '1.4rem',
                letterSpacing: '-0.02em',
                color: '#f5f5f7',
                marginBottom: '0.3rem'
              }}
            >
              CONTROL
            </h4>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                color: 'var(--text-secondary)',
                lineHeight: 1.4
              }}
            >
              Active electro-torque vectoring measuring wheel slip every millisecond.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
