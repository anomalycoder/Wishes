import React, { useState, useEffect, useRef } from 'react';
import { Fireworks } from 'fireworks-js';

// --- Config ---
const BG_IMAGE = "/images/img3.png";
const CLIMAX_TEXT = "Happy Birthday Aarohi";
const SHOWTIME_DURATION = 120000; // 2 minutes (120 seconds)

const SceneFinale = () => {
    const [stage, setStage] = useState('ready'); // ready -> countdown -> showtime -> climax -> ending
    const [timeLeft, setTimeLeft] = useState(120);

    const containerRef = useRef(null);
    const patternCanvasRef = useRef(null);
    const fireworksInstance = useRef(null);
    const requestRef = useRef(null);
    const showtimeTimerRef = useRef(null);

    const startMagic = () => {
        if (stage !== 'ready') return;
        setStage('countdown');
    };

    const skipToFinale = (e) => {
        if (e) e.stopPropagation();
        if (stage === 'showtime') {
            if (showtimeTimerRef.current) clearTimeout(showtimeTimerRef.current);
            setStage('climax');
        }
    };

    // Stage Transitions & Timers
    useEffect(() => {
        if (stage === 'countdown') {
            const timer = setTimeout(() => {
                setStage('showtime');
            }, 6000);
            return () => clearTimeout(timer);
        }

        if (stage === 'showtime') {
            const tick = setInterval(() => {
                setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1));
            }, 1000);

            showtimeTimerRef.current = setTimeout(() => {
                setStage('climax');
            }, SHOWTIME_DURATION);

            return () => {
                clearInterval(tick);
                clearTimeout(showtimeTimerRef.current);
            };
        }

        if (stage === 'climax') {
            // Stop the background fireworks immediately to focus on the climax and prevent lag
            if (fireworksInstance.current) {
                fireworksInstance.current.stop();
                fireworksInstance.current = null;
            }

            // Wait LONGER as requested (20 seconds) to enjoy the final explosion
            const endTimer = setTimeout(() => {
                setStage('ending');
            }, 20000);
            return () => clearTimeout(endTimer);
        }
    }, [stage]);

    // Format time mm:ss
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Fireworks & Canvas Logic
    useEffect(() => {
        // Background fireworks only during showtime now
        if (stage === 'showtime') {
            if (containerRef.current && !fireworksInstance.current) {
                fireworksInstance.current = new Fireworks(containerRef.current, {
                    autoresize: true, opacity: 0.5, acceleration: 1.005, friction: 0.99, gravity: 0.4,
                    particles: 50, trace: 2, explosion: 4, intensity: 8, flickering: 30,
                    hue: { min: 0, max: 360 }, delay: { min: 80, max: 150 }, rocketsPoint: { min: 50, max: 50 },
                    lineWidth: { explosion: { min: 1, max: 3 }, trace: { min: 1, max: 1 } },
                    brightness: { min: 40, max: 70 }, decay: { min: 0.005, max: 0.01 },
                });
                fireworksInstance.current.start();
            }
        }

        const canvas = patternCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let rockets = [];
        let textParticles = [];
        let shockwaves = [];
        let climaxRocket = null;
        let climaxExploded = false;

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        class Shockwave {
            constructor(x, y, color) {
                this.x = x; this.y = y; this.color = color; this.radius = 0; this.maxRadius = Math.max(canvas.width, canvas.height) * 0.4;
                this.alpha = 1; this.thickness = 40;
            }
            draw() {
                ctx.save(); ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.strokeStyle = this.color; ctx.lineWidth = this.thickness * this.alpha; ctx.globalAlpha = this.alpha * 0.3; ctx.stroke(); ctx.restore();
            }
            update() { this.radius += 15; this.alpha -= 0.02; }
        }

        class Rocket {
            constructor(startX, startY, targetX, targetY, color, isHeart, isClimax = false) {
                this.x = startX; this.y = startY; this.targetX = targetX; this.targetY = targetY;
                this.color = color; this.isHeart = isHeart; this.isClimax = isClimax; this.speed = isClimax ? 8 : 4;
                this.completed = false; this.trail = [];
            }
            update() {
                this.trail.push({ x: this.x, y: this.y }); if (this.trail.length > 20) this.trail.shift();
                const dx = this.targetX - this.x; const dy = this.targetY - this.y; const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.speed) { this.completed = true; if (!this.isClimax) this.explode(); } else { this.x += (dx / distance) * this.speed; this.y += (dy / distance) * this.speed; }
            }
            draw() {
                this.trail.forEach((t, i) => { ctx.save(); ctx.globalAlpha = (i / this.trail.length) * 0.5; ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(t.x, t.y, this.isClimax ? 4 : 2, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
                ctx.save(); ctx.fillStyle = 'white'; ctx.shadowBlur = 20; ctx.shadowColor = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.isClimax ? 6 : 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
            }
            explode() {
                const count = this.isHeart ? 40 : 35;
                for (let i = 0; i < count; i++) {
                    const p = new BasicParticle(this.x, this.y, this.color);
                    if (this.isHeart) { const t = (i / count) * Math.PI * 2; const vx = 16 * Math.pow(Math.sin(t), 3); const vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)); p.velocity = { x: vx * 0.2, y: vy * 0.2 }; }
                    else { const angle = (i / count) * Math.PI * 2; const speed = 3 + Math.random() * 2; p.velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }; }
                    particles.push(p);
                }
            }
        }

        class BasicParticle {
            constructor(x, y, color) { this.x = x; this.y = y; this.color = color; this.size = Math.random() * 2.5 + 1.5; this.alpha = 1; this.velocity = { x: 0, y: 0 }; this.gravity = 0.02; this.decay = Math.random() * 0.008 + 0.005; }
            draw() { ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color; ctx.shadowBlur = 5; ctx.shadowColor = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
            update() { this.x += this.velocity.x; this.y += this.velocity.y; this.velocity.y += this.gravity; this.alpha -= this.decay; }
        }

        class TextParticle {
            constructor(x, y, targetX, targetY, color) { this.x = x; this.y = y; this.targetX = targetX; this.targetY = targetY; this.color = color; this.size = Math.random() * 3 + 1.2; this.alpha = 0; this.delay = Math.random() * 1200; this.settled = false; this.speed = 0.03 + Math.random() * 0.02; }
            draw() { ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color; ctx.shadowBlur = 8; ctx.shadowColor = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
            update() { if (this.alpha < 1) this.alpha += 0.015; const dx = this.targetX - this.x; const dy = this.targetY - this.y; if (!this.settled) { this.x += dx * this.speed; this.y += dy * this.speed; if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) this.settled = true; } else { this.x = this.targetX + Math.sin(Date.now() * 0.002 + this.targetX) * 0.8; this.y = this.targetY + Math.cos(Date.now() * 0.002 + this.targetY) * 0.8; } }
        }

        const initClimaxExplosion = (centerX, centerY) => {
            shockwaves.push(new Shockwave(centerX, centerY, '#FF69B4'));
            const tempCanvas = document.createElement('canvas'); const tCtx = tempCanvas.getContext('2d'); tempCanvas.width = canvas.width; tempCanvas.height = canvas.height;
            const fontSize = Math.min(canvas.width / 11, 110); tCtx.font = `900 ${fontSize}px "Outfit", sans-serif`; tCtx.fillStyle = 'white'; tCtx.textAlign = 'center'; tCtx.fillText(CLIMAX_TEXT, canvas.width / 2, canvas.height / 2);
            const imgData = tCtx.getImageData(0, 0, canvas.width, canvas.height).data;
            const skip = 3; for (let y = 0; y < canvas.height; y += skip) { for (let x = 0; x < canvas.width; x += skip) { if (imgData[((y * canvas.width) + x) * 4 + 3] > 128) { const ratio = x / canvas.width; const hue = 320 + ratio * 60; textParticles.push(new TextParticle(centerX, centerY, x, y, `hsla(${hue}, 100%, 75%, 1)`)); } } }
            for (let i = 0; i < 150; i++) { const p = new BasicParticle(centerX, centerY, '#FFB6C1'); const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 12 + 4; p.velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }; particles.push(p); }
            climaxExploded = true;
        };

        const animate = (time) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Spawn background rockets ONLY in showtime
            if (stage === 'showtime' && time - (requestRef.current_lastRocket || 0) > 7000) {
                const startX = canvas.width * (0.1 + Math.random() * 0.8);
                rockets.push(new Rocket(startX, canvas.height + 20, startX + (Math.random() - 0.5) * 200, canvas.height * (0.15 + Math.random() * 0.35), `hsla(${Math.random() * 360}, 100%, 75%, 1)`, Math.random() > 0.4));
                requestRef.current_lastRocket = time;
            }
            if (stage === 'climax' && !climaxRocket && !climaxExploded) climaxRocket = new Rocket(canvas.width / 2, canvas.height + 100, canvas.width / 2, canvas.height / 2, '#FF1493', false, true);
            if (climaxRocket) { climaxRocket.update(); climaxRocket.draw(); if (climaxRocket.completed) { initClimaxExplosion(climaxRocket.x, climaxRocket.y); climaxRocket = null; } }
            shockwaves = shockwaves.filter(s => s.alpha > 0); shockwaves.forEach(s => { s.update(); s.draw(); });
            rockets = rockets.filter(r => !r.completed); rockets.forEach(r => { r.update(); r.draw(); });
            particles = particles.filter(p => p.alpha > 0); particles.forEach(p => { p.update(); p.draw(); });
            textParticles.forEach(tp => { tp.update(); tp.draw(); });
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);

        return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(requestRef.current); if (fireworksInstance.current) { fireworksInstance.current.stop(); fireworksInstance.current = null; } };
    }, [stage]);

    return (
        <section
            className="page-section"
            style={{
                position: 'relative',
                background: `url(${BG_IMAGE}) center center / cover no-repeat fixed`,
                width: '100vw',
                height: '100vh',
                overflow: 'hidden'
            }}
            onClick={stage === 'ready' ? startMagic : undefined}
        >
            {/* Background Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: stage === 'ending' ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.45)',
                zIndex: 1,
                transition: 'background-color 4s ease'
            }} />

            {/* Fireworks layer */}
            {(stage === 'showtime' || stage === 'climax') && (
                <>
                    <div ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} />
                    <canvas ref={patternCanvasRef} style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }} />
                </>
            )}

            <div style={{ zIndex: 10, textAlign: 'center', width: '100%', position: 'absolute', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                {stage === 'ready' && (
                    <div style={{ animation: 'fadeIn 2s', cursor: 'pointer', pointerEvents: 'auto' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 200, letterSpacing: '10px', textTransform: 'uppercase', marginBottom: '20px', color: 'white' }}>The Grand Finale</h2>
                        <div style={{ fontSize: '1.2rem', color: '#ff69b4', letterSpacing: '4px', animation: 'pulseAnim 2s infinite' }}>CLICK OR PRESS ENTER</div>
                    </div>
                )}
                {stage === 'countdown' && (
                    <div className="countdown-css-container">
                        {[5, 4, 3, 2, 1].map(d => <div key={d} className="digit">{d}</div>)}
                    </div>
                )}

                {stage === 'ending' && (
                    <div style={{ animation: 'fadeInUp 4s forwards' }}>
                        <h2 style={{
                            fontFamily: "'Great Vibes', cursive",
                            fontSize: '5rem',
                            color: '#D1AB3E',
                            textShadow: '0 0 30px rgba(209, 171, 62, 0.5)',
                            marginBottom: '40px'
                        }}>
                            Happy Birthday, Aarohi!
                        </h2>
                        <p style={{
                            fontSize: '1.4rem',
                            color: '#ff69b4',
                            letterSpacing: '8px',
                            textTransform: 'uppercase',
                            opacity: 0.9,
                            fontWeight: 300,
                            marginBottom: '20px'
                        }}>
                            I HOPE YOU LIKE IT! ✨
                        </p>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'white',
                            letterSpacing: '4px',
                            opacity: 0.5
                        }}>
                            HAVE THE BEST 19th EVER.
                        </p>
                    </div>
                )}
            </div>

            {stage === 'showtime' && (
                <div style={{ position: 'absolute', bottom: '40px', right: '40px', zIndex: 100, animation: 'fadeIn 2s' }}>
                    <button onClick={skipToFinale} style={{
                        padding: '14px 35px',
                        background: 'rgba(255,105,180,0.15)',
                        border: '1.5px solid rgba(255,105,180,0.6)',
                        borderRadius: '50px',
                        color: 'white',
                        fontSize: '1rem',
                        letterSpacing: '3px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.4s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        boxShadow: '0 0 20px rgba(255,105,180,0.2)'
                    }}>
                        <span>FINAL SURPRISE</span>
                        <span style={{
                            background: '#ff69b4',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            minWidth: '60px'
                        }}>{formatTime(timeLeft)}</span>
                    </button>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeInUp { 
                    from { opacity: 0; transform: translateY(40px); } 
                    to { opacity: 1; transform: translateY(0); } 
                }
                @keyframes pulseAnim { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; transform: scale(1.05); } }
                .countdown-css-container { position: relative; height: 200px; display: flex; justify-content: center; align-items: center; }
                .digit { position: absolute; font-size: 15rem; font-weight: 100; color: white; opacity: 0; transform: scale(0.8); text-shadow: 0 0 30px rgba(255,255,255,0.4); pointer-events: none; }
                .digit:nth-child(1) { animation: countStep 1s forwards 0s; } .digit:nth-child(2) { animation: countStep 1s forwards 1s; } .digit:nth-child(3) { animation: countStep 1s forwards 2s; } .digit:nth-child(4) { animation: countStep 1s forwards 3s; } .digit:nth-child(5) { animation: countStep 1s forwards 4s; }
                @keyframes countStep { 0% { transform: scale(0.8); opacity: 0; } 30% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.2); opacity: 0; } }
            `}</style>
        </section>
    );
};

export default SceneFinale;
