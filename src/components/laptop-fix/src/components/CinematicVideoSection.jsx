import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { audioEngine } from './AudioEngine';
import { FRAMES, IS_MOBILE, hasBlob, peek, decode, nearest, evict } from './frameSequence';

gsap.registerPlugin(ScrollTrigger);

const MARKERS = [
  ['01 // MATRIX', 'PRECISION', 'Quad-LED matrix architecture sculpted for zero light scatter.'],
  ['02 // AIRFLOW', 'AERODYNAMICS', 'Negative-pressure underbody channels delivering 380 kg downforce.'],
  ['03 // CHASSIS', 'CONTROL', 'Active electro-torque vectoring measuring wheel slip every millisecond.']
];

const clamp01 = (n) => Math.max(0, Math.min(1, n));

// Draws one clip's frames onto a canvas. Only repaints when the frame changes.
function makePlayer(canvas, clip) {
  const g = canvas.getContext('2d', { alpha: false });
  let wanted = -1;   // last frame index we were asked for (and have data for)
  let painted = -1;  // frame index currently on the canvas
  let last = 0;

  const paint = (bmp, index) => {
    if (canvas.width !== bmp.width || canvas.height !== bmp.height) {
      canvas.width = bmp.width;
      canvas.height = bmp.height;
    }
    try {
      g.drawImage(bmp, 0, 0);
      painted = index;
    } catch (e) {
      /* bitmap was freed: it will be decoded again on the next tick */
      wanted = -1;
    }
  };

  return {
    show(i) {
      if (i === wanted) return;
      const exact = peek(clip, i);
      if (exact) {
        paint(exact, i);
      } else {
        const near = nearest(clip, i);
        if (near && near.index !== painted) paint(near.bmp, near.index);
        decode(clip, i).then((bmp) => {
          if (!bmp) { if (i === wanted) wanted = -1; return; } // failed: try again next tick
          if (i === wanted) paint(bmp, i);
        });
      }
      if (hasBlob(clip, i)) wanted = i; // if the frame hasn't downloaded yet, try again next tick

      // decode ahead in the scroll direction (and a few behind, for scrolling back)
      const dir = i >= last ? 1 : -1;
      last = i;
      for (let k = 1; k <= 12; k++) {
        const j = i + dir * k;
        if (j >= 0 && j < FRAMES) decode(clip, j);
      }
      for (let k = 1; k <= 5; k++) {
        const j = i - dir * k;
        if (j >= 0 && j < FRAMES) decode(clip, j);
      }
      evict(clip, i);
    }
  };
}

export default function CinematicVideoSection() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const canvas1Ref = useRef(null);
  const canvas2Ref = useRef(null);
  const heroTextRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const transitionCurtainRef = useRef(null);
  const scene2LabelRef = useRef(null);
  const scene2HeadlineRef = useRef(null);
  const techMarkersRef = useRef(null);

  const mobile = IS_MOBILE;

  useEffect(() => {
    const c1 = canvas1Ref.current;
    const c2 = canvas2Ref.current;
    if (!c1 || !c2 || !containerRef.current || !stageRef.current) return;

    ScrollTrigger.config({ ignoreMobileResize: true });

    const p1 = makePlayer(c1, 0);
    const p2 = makePlayer(c2, 1);
    p2.show(0); // warm up the first frame of clip 2

    let raf = 0;
    let tl = null;

    const tick = () => {
      raf = requestAnimationFrame(tick); // schedule first so one error can never stop the loop
      if (!tl) return;
      try {
        const t = tl.time();
        // each clip parks on its first/last frame outside its own range, which also
        // keeps the frames around the seam decoded so scrolling back up stays smooth
        p1.show(Math.round(clamp01(t / 0.46) * (FRAMES - 1)));
        p2.show(Math.round(clamp01((t - 0.48) / 0.52) * (FRAMES - 1)));
      } catch (e) {
        console.error(e);
      }
    };
    raf = requestAnimationFrame(tick);

    const ctx = gsap.context(() => {
      gsap.set(c1, { opacity: 1, scale: 1 });
      gsap.set(c2, { opacity: 0, scale: 1.05 });
      gsap.set(heroTextRef.current, { opacity: 1, y: 0 });
      gsap.set(scrollIndicatorRef.current, { opacity: 1 });
      gsap.set(scene2LabelRef.current, { opacity: 0, y: 20 });
      gsap.set(scene2HeadlineRef.current, { opacity: 0, y: 30 });
      gsap.set(techMarkersRef.current, { opacity: 0 });

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: stageRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          scrub: mobile ? 0.5 : 0.8,
          onUpdate: (self) => {
            const speed = Math.abs(self.getVelocity()) / 1000;
            audioEngine.modulate(speed);
          }
        }
      });

      tl.to(scrollIndicatorRef.current, { opacity: 0, y: 15, duration: 0.06, ease: 'power2.out' }, 0.01);
      tl.to(heroTextRef.current, { opacity: 0, y: -50, duration: 0.16, ease: 'power2.inOut' }, 0.18);
      tl.to(c1, { scale: 1.05, opacity: 0, duration: 0.1, ease: 'power2.inOut' }, 0.44);
      tl.fromTo(transitionCurtainRef.current, { opacity: 0 },
        { opacity: 0.55, duration: 0.06, ease: 'power2.in', yoyo: true, repeat: 1 }, 0.45);
      tl.to(c2, { opacity: 1, scale: 1, duration: 0.1, ease: 'power2.inOut' }, 0.46);
      tl.to(scene2LabelRef.current, { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.49);
      tl.to(scene2HeadlineRef.current, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.51);
      tl.to(scene2HeadlineRef.current, { opacity: 0, y: -40, duration: 0.09, ease: 'power2.in' }, 0.69);
      tl.to(scene2LabelRef.current, { opacity: 0, y: -20, duration: 0.08, ease: 'power2.in' }, 0.71);
      tl.to(techMarkersRef.current, { opacity: 1, duration: 0.08, ease: 'power2.out' }, 0.78);
      tl.to(techMarkersRef.current, { opacity: 0, y: -20, duration: 0.06, ease: 'power2.in' }, 0.95);
    }, containerRef);

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [mobile]);

  const marker = ([tag, title, text]) => (
    <div key={title} style={{ flex: mobile ? '0 0 auto' : '1 1 200px', maxWidth: mobile ? '100%' : '280px' }}>
      <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: mobile ? '0.5rem' : '0.8rem' }} />
      <div className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--accent-red)', letterSpacing: '0.2em', marginBottom: '0.2rem' }}>{tag}</div>
      <h4 className="font-display" style={{ fontSize: mobile ? '1.15rem' : '1.4rem', letterSpacing: '-0.02em', color: '#f5f5f7', marginBottom: mobile ? 0 : '0.3rem' }}>{title}</h4>
      {!mobile && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.08em', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{text}</p>
      )}
    </div>
  );

  const canvasStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    willChange: 'transform, opacity'
  };

  return (
    <section id="hero" ref={containerRef}
      style={{ position: 'relative', width: '100%', height: mobile ? '520svh' : '650svh', backgroundColor: '#08080a' }}>
      <div id="machine" style={{ position: 'absolute', top: '48%', left: 0, height: '1px' }} />

      <div ref={stageRef} className="video-canvas-stage"
        style={{ position: 'relative', top: 0, left: 0, width: '100%', height: '100svh', overflow: 'hidden' }}>
        <canvas ref={canvas1Ref} className="video-element" style={{ ...canvasStyle, zIndex: 1 }} />
        <canvas ref={canvas2Ref} className="video-element" style={{ ...canvasStyle, zIndex: 2 }} />

        <div ref={transitionCurtainRef}
          style={{ position: 'absolute', inset: 0, backgroundColor: '#08080a', opacity: 0, pointerEvents: 'none', zIndex: 3 }} />

        <div className="cinematic-vignette" style={{ zIndex: 4 }} />
        <div className="cinematic-overlay-bottom" style={{ zIndex: 4 }} />
        <div className="cinematic-overlay-top" style={{ zIndex: 4 }} />

        <div ref={heroTextRef}
          style={{ position: 'absolute', bottom: mobile ? '10svh' : '8vh', left: '6vw', right: mobile ? '6vw' : 'auto', maxWidth: '750px', zIndex: 10, pointerEvents: 'none' }}>
          <div style={{ marginBottom: '1.2rem' }}><span className="tech-label">PERFORMANCE / 01</span></div>
          <h1 className="font-display"
            style={{ fontSize: mobile ? 'clamp(2.6rem, 14vw, 5rem)' : 'clamp(2.6rem, 8.2vw, 8rem)', lineHeight: 0.92, color: '#f5f5f7', marginBottom: mobile ? '1.2rem' : '1.8rem', letterSpacing: '-0.045em', wordBreak: 'break-word' }}>
            BUILT<br />TO MOVE.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: mobile ? '1rem' : 'clamp(0.95rem, 1.4vw, 1.15rem)', color: 'var(--text-secondary)', maxWidth: '460px', lineHeight: 1.6, fontWeight: 300, letterSpacing: '0.01em' }}>
            An uncompromising study in motion, precision and form.
          </p>
        </div>

        <div ref={scrollIndicatorRef}
          style={{ position: 'absolute', bottom: '4vh', right: '6vw', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', pointerEvents: 'none' }}>
          <span className="font-mono" style={{ fontSize: '0.68rem', letterSpacing: '0.22em', color: 'var(--text-secondary)' }}>
            SCROLL TO EXPLORE &darr;
          </span>
          <div style={{ width: '45px', height: '1px', backgroundColor: 'rgba(255,255,255,0.25)' }} />
        </div>

        <div ref={scene2LabelRef}
          style={{ position: 'absolute', top: mobile ? '14svh' : '15vh', left: '6vw', zIndex: 10, pointerEvents: 'none' }}>
          <span className="tech-label">THE MACHINE / 02</span>
        </div>

        <div ref={scene2HeadlineRef}
          style={{ position: 'absolute', top: mobile ? '20svh' : '22vh', left: '6vw', right: mobile ? '6vw' : 'auto', maxWidth: '900px', zIndex: 10, pointerEvents: 'none' }}>
          <h2 className="font-display"
            style={{ fontSize: mobile ? 'clamp(2.4rem, 12.5vw, 4.5rem)' : 'clamp(2.4rem, 7.5vw, 7.5rem)', lineHeight: 0.94, color: '#f5f5f7', letterSpacing: '-0.04em', wordBreak: 'break-word' }}>
            FORM<br />FOLLOWS<br />FORCE.
          </h2>
        </div>

        <div ref={techMarkersRef}
          style={{
            position: 'absolute', bottom: mobile ? '5svh' : '7vh', left: '6vw', right: '6vw', zIndex: 10,
            display: 'flex', flexDirection: mobile ? 'column' : 'row',
            justifyContent: 'space-between', alignItems: mobile ? 'stretch' : 'flex-end',
            gap: mobile ? '0.9rem' : '2rem', flexWrap: 'wrap', pointerEvents: 'none'
          }}>
          {MARKERS.map(marker)}
        </div>
      </div>
    </section>
  );
}
