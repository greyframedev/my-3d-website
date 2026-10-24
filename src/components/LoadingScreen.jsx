import React, { useEffect, useState } from 'react';
import { startPreload, IS_MOBILE } from './frameSequence';

export default function LoadingScreen({ onLoaded }) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const MIN = IS_MOBILE ? 1200 : 1800;   // shortest time the loader shows
    const MAX = IS_MOBILE ? 5000 : 9000;   // never wait longer than this
    const start = performance.now();

    let ready = false;
    let done = false;
    let raf = 0;
    let exitTimer = 0;

    // Only the opening frames are needed to start. The rest download in the background.
    startPreload().ready.then(() => { ready = true; });

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      setPct(100);
      setLeaving(true);
      exitTimer = window.setTimeout(onLoaded, 600);
    };

    const loop = (now) => {
      const elapsed = now - start;
      const cap = ready ? 100 : 90;
      setPct(Math.round(Math.min(cap, (elapsed / MIN) * 100)));
      if ((ready && elapsed >= MIN) || elapsed >= MAX) {
        finish();
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: '#08080a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: leaving ? 0 : 1,
        transition: 'opacity 0.6s ease',
        pointerEvents: leaving ? 'none' : 'auto'
      }}
    >
      <div style={{ width: 'min(360px, 80vw)', textAlign: 'center' }}>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.4em', color: '#6b6b72', marginBottom: '1.4rem' }}>
          AERION AUTOMOBILI
        </div>
        <div style={{ fontSize: '0.78rem', letterSpacing: '0.28em', color: '#f5f5f7', fontWeight: 600, marginBottom: '1.6rem' }}>
          LOADING EXPERIENCE
        </div>
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.12)' }}>
          <div
            style={{
              height: '100%',
              width: pct + '%',
              background: '#f5f5f7',
              transition: 'width 0.15s linear'
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.8rem',
            fontSize: '0.58rem',
            letterSpacing: '0.18em',
            color: '#6b6b72'
          }}
        >
          <span>BUFFERING SCENE 01 FOOTAGE</span>
          <span style={{ color: '#f5f5f7', fontWeight: 600 }}>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
