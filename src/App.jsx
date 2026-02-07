import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useProgress, Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Scene1 from './Scene1';
import Scene5 from './Scene5';
import Scene2 from './Scene2';
import Scene7 from './Scene7';
import Scene3 from './Scene3';
import Scene4 from './Scene4';
import SceneFinale from './SceneFinale';
import './App.css';

// --- Loading Screen Component ---
function LoadingScreen({ started, onStarted }) {
  const { progress } = useProgress();
  const [loaded, setLoaded] = useState(false);

  // Preload assets logic could be here or separate, but useGLTF.preload handles it.
  // We re-add explicit preload if needed, but useProgress tracks active requests.
  // Let's add the preload back for safety.
  useEffect(() => {
    useGLTF.preload('/cake.glb');
  }, []);

  useEffect(() => {
    if (progress >= 100) setLoaded(true);
  }, [progress]);

  return (
    <div className={`loading-overlay`}>
      <div className="loader-content">
        {!loaded ? (
          <>
            <h1 className="loader-title">Gathering Stardust... ✨</h1>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="loader-percent">{Math.round(progress)}%</p>
          </>
        ) : (
          <div className="enter-button-container">
            <h1 className="loader-title">Everything is Ready! 💖</h1>
            <button className="enter-button" onClick={onStarted}>
              Enter Celebration 🎂
            </button>
          </div>
        )}
      </div>
      <style>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #0c0c1d;
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: opacity 1s ease-in-out, visibility 1s;
          pointer-events: ${started ? 'none' : 'auto'};
          opacity: ${started ? 0 : 1};
          visibility: ${started ? 'hidden' : 'visible'};
        }
        .loader-content {
          text-align: center;
          color: white;
          font-family: 'Poppins', sans-serif;
        }
        .loader-title {
          font-family: 'Great Vibes', cursive;
          font-size: 3rem;
          color: #ff69b4;
          margin-bottom: 20px;
          text-shadow: 0 0 20px rgba(255, 105, 180, 0.6);
        }
        .progress-bar-container {
          width: 300px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          margin: 0 auto 15px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ff69b4, #ff1493);
          transition: width 0.3s ease-out;
        }
        .loader-percent {
          font-size: 1.2rem;
          opacity: 0.8;
          letter-spacing: 2px;
        }
        .enter-button {
          padding: 15px 40px;
          font-size: 1.5rem;
          background: #ff69b4;
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Great Vibes', cursive;
          box-shadow: 0 0 30px rgba(255, 105, 180, 0.6);
          transition: transform 0.2s, box-shadow 0.2s;
          animation: pulseBtn 2s infinite;
        }
        .enter-button:hover {
          transform: scale(1.1);
          box-shadow: 0 0 50px rgba(255, 105, 180, 0.9);
        }
        @keyframes pulseBtn {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// --- LazyScene Wrapper ---
const LazyScene = ({ children, height = "100vh" }) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasLoaded(true);
        }
      },
      { root: null, threshold: 0, rootMargin: "800px" }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => { if (containerRef.current) observer.unobserve(containerRef.current); };
  }, []);

  return (
    <section ref={containerRef} style={{ minHeight: height, width: '100%', position: 'relative', background: '#0c0c1d', overflow: 'hidden' }}>
      {hasLoaded ? children : <div style={{ height: height }} />}
    </section>
  );
};

function App() {
  const [started, setStarted] = useState(false);

  return (
    <>
      <LoadingScreen started={started} onStarted={() => setStarted(true)} />

      {/* 
        We render the App content behind the loader so resources start fetching immediately 
        but use CSS to hide/lock scroll until 'started' is true. 
      */}
      <main
        className="app-container"
        style={{
          height: '100vh',
          overflowY: started ? 'auto' : 'hidden',
          opacity: started ? 1 : 0, // Fade in the app when ready
          transition: 'opacity 1s ease-in'
        }}
      >
        <LazyScene><Scene1 /></LazyScene>
        <LazyScene><Scene5 /></LazyScene>
        <LazyScene><Scene2 /></LazyScene>
        <LazyScene><Scene7 /></LazyScene>
        <LazyScene><Scene3 /></LazyScene>
        <LazyScene><Scene4 /></LazyScene>
        <LazyScene><SceneFinale /></LazyScene>
      </main>
    </>
  );
}

export default App;
