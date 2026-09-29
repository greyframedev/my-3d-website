import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ onLoaded, video1Ref, video2Ref }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING ENGINE TIMELINE');
  const screenRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    let currentProgress = 0;
    let v1Ready = false;
    let v2Ready = false;

    const interval = setInterval(() => {
      // Check video ready states
      const v1 = video1Ref?.current;
      const v2 = video2Ref?.current;

      if (v1 && (v1.readyState >= 2 || v1.buffered.length > 0)) {
        v1Ready = true;
      }
      if (v2 && (v2.readyState >= 2 || v2.buffered.length > 0)) {
        v2Ready = true;
      }

      // Increment progress realistically
      if (currentProgress < 65) {
        currentProgress += Math.floor(Math.random() * 8) + 4;
        if (currentProgress > 30) setStatusText('BUFFERING SCENE 01 FOOTAGE');
      } else if (currentProgress < 90) {
        if (v1Ready && v2Ready) {
          currentProgress += 6;
          setStatusText('CALIBRATING DUAL SCROLL TIMELINE');
        } else {
          currentProgress += 1;
        }
      } else if (currentProgress < 100) {
        currentProgress += 2;
        setStatusText('SYSTEMS SYNCHRONIZED');
      }

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setProgress(100);

        // Smooth cinematic exit transition
        setTimeout(() => {
          if (screenRef.current) {
            gsap.to(screenRef.current, {
              opacity: 0,
              y: -30,
              duration: 0.9,
              ease: 'power3.inOut',
              onComplete: () => {
                if (onLoaded) onLoaded();
              }
            });
          }
        }, 350);
      } else {
        setProgress(currentProgress);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [video1Ref, video2Ref, onLoaded]);

  return (
    <div
      ref={screenRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#08080a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f5f5f7',
        userSelect: 'none'
      }}
    >
      {/* Background Subtle Grid Texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '380px',
          width: '90%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Brand Monogram */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.35em',
            color: 'var(--text-muted)',
            marginBottom: '1.2rem',
            textTransform: 'uppercase'
          }}
        >
          AERION AUTOMOBILI
        </div>

        {/* Main Title */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.88rem',
            letterSpacing: '0.22em',
            fontWeight: 500,
            color: '#f5f5f7',
            marginBottom: '2rem',
            textTransform: 'uppercase'
          }}
        >
          LOADING EXPERIENCE
        </div>

        {/* Minimal Progress Line */}
        <div
          style={{
            width: '100%',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '1.2rem'
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${progress}%`,
              backgroundColor: '#f5f5f7',
              transition: 'width 0.1s ease-out'
            }}
          />
        </div>

        {/* Technical Telemetry Row */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            letterSpacing: '0.15em',
            color: 'var(--text-secondary)'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>{statusText}</span>
          <span style={{ fontWeight: 600, color: '#f5f5f7' }}>
            {String(progress).padStart(2, '0')}%
          </span>
        </div>
      </div>
    </div>
  );
}
