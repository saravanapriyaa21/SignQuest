import React, { useEffect, useState } from 'react';
import GameCompleteBg from '../assets/game_complete.jpg';

export default function GameComplete({ user, onPlayAgain, onBackToMap, onShowLeaderboard }) {
    const [displayXp, setDisplayXp] = useState(0);

    // Advanced Firework/Firecracker Effect - Spread out & Balanced
    useEffect(() => {
        const duration = 30 * 1000;
        const animationEnd = Date.now() + duration;

        const createFirework = () => {
            if (Date.now() > animationEnd) return;

            // SPREAD: Use full width but keep away from extreme edges
            const x = Math.random() * 90 + 5;
            // VARIETY: Rockets reach different heights (20% to 70% of screen)
            const targetY = Math.random() * 50 + 20;

            const rocket = document.createElement('div');
            rocket.style.position = 'fixed';
            rocket.style.left = x + 'vw';
            rocket.style.bottom = '-50px';
            rocket.style.width = '5px';
            rocket.style.height = '30px';
            rocket.style.background = 'linear-gradient(to top, transparent, #fff, #6c5ce7)';
            rocket.style.borderRadius = '50% 50% 0 0';
            rocket.style.zIndex = '9999';
            rocket.style.boxShadow = '0 0 20px #a29bfe, 0 0 40px #6c5ce7';
            rocket.style.transition = 'bottom 1.2s cubic-bezier(0.1, 0.5, 0.1, 1)';

            document.body.appendChild(rocket);

            requestAnimationFrame(() => {
                rocket.style.bottom = (100 - targetY) + 'vh';
            });

            // The "Burst"
            setTimeout(() => {
                if (!rocket.parentNode) return;
                rocket.style.opacity = '0';
                setTimeout(() => rocket.remove(), 100);

                const sparkCount = 40 + Math.floor(Math.random() * 20);
                const colors = ['#ff7675', '#fdcb6e', '#55efc4', '#ff9ff3', '#00d2d3', '#feca57', '#fffa65', '#fff'];
                const mainColor = colors[Math.floor(Math.random() * colors.length)];

                for (let i = 0; i < sparkCount; i++) {
                    const spark = document.createElement('div');

                    if (Math.random() > 0.4) {
                        spark.style.width = (Math.random() * 5 + 3) + 'px';
                        spark.style.height = spark.style.width;
                        spark.style.borderRadius = '50%';
                    } else {
                        spark.innerText = '✨';
                        spark.style.fontSize = (Math.random() * 8 + 12) + 'px';
                    }

                    spark.style.position = 'fixed';
                    spark.style.left = x + 'vw';
                    spark.style.top = targetY + 'vh';
                    spark.style.background = spark.innerText ? 'transparent' : mainColor;
                    spark.style.color = mainColor;
                    spark.style.zIndex = '9999';
                    spark.style.pointerEvents = 'none';
                    spark.style.boxShadow = spark.innerText ? 'none' : `0 0 20px ${mainColor}`;

                    // EXPANSIVE PHYSICS: Larger explosion radius
                    const angle = (i / sparkCount) * Math.PI * 2;
                    const velocity = 4 + Math.random() * 10; // Faster initial burst
                    let vx = Math.cos(angle) * velocity;
                    let vy = Math.sin(angle) * velocity;
                    let posX = x * (window.innerWidth / 100);
                    let posY = targetY * (window.innerHeight / 100);

                    document.body.appendChild(spark);

                    let life = 1.0;
                    const animateSpark = () => {
                        life -= 0.012; // Longer life
                        vy += 0.12; // Gravity
                        vx *= 0.98; // Air resistance
                        posX += vx;
                        posY += vy;

                        spark.style.left = posX + 'px';
                        spark.style.top = posY + 'px';
                        spark.style.opacity = life;
                        spark.style.transform = `scale(${life}) rotate(${life * 360}deg)`;

                        if (life > 0) {
                            requestAnimationFrame(animateSpark);
                        } else {
                            spark.remove();
                        }
                    };

                    requestAnimationFrame(animateSpark);
                }
            }, 1200);

            // Schedule next firecracker - Slightly more delay to feel less crowded
            setTimeout(createFirework, 800 + Math.random() * 1200);
        };

        // Staggered start
        for (let i = 0; i < 3; i++) setTimeout(createFirework, i * 600);

        // XP Counter Animation
        const targetXp = user.xp || 0;
        const step = Math.max(1, Math.floor(targetXp / 50));
        let current = 0;

        const counter = setInterval(() => {
            current += step;
            if (current >= targetXp) {
                setDisplayXp(targetXp);
                clearInterval(counter);
            } else {
                setDisplayXp(current);
            }
        }, 30);

        return () => clearInterval(counter);
    }, [user.xp]);

    const buttonStyle = (color) => ({
        background: color,
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        fontSize: '18px',
        fontWeight: 'bold',
        borderRadius: '15px',
        cursor: 'pointer',
        transition: 'transform 0.1s, filter 0.2s',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    });

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            fontFamily: '"Comic Sans MS", cursive, sans-serif'
        }}>
            {/* Background Image */}
            <img
                src={GameCompleteBg}
                alt="Celebration"
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: -2
                }}
            />

            {/* White Overlay */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(3px)',
                zIndex: -1
            }} />

            {/* Popup Card */}
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '30px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                textAlign: 'center',
                maxWidth: '500px',
                width: '90%',
                animation: 'popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <h1 style={{ color: '#6c5ce7', margin: '0 0 10px 0', fontSize: '2.5rem' }}>Adventure Complete! 🏆</h1>
                <p style={{ color: '#636e72', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
                    You’ve explored all current lands in SignQuest.<br />
                    More worlds, signs, and challenges are coming soon.<br />
                    <strong>Your journey has only just begun.</strong>
                </p>

                {/* Stats Block */}
                <div style={{
                    background: '#f1f2f6',
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px' }}>✨</div>
                        <div style={{ fontWeight: 'bold', color: '#6c5ce7', fontSize: '24px' }}>{displayXp}</div>
                        <div style={{ fontSize: '12px', color: '#b2bec3' }}>Total XP</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px' }}>🏅</div>
                        <div style={{ fontWeight: 'bold', color: '#6c5ce7' }}>{user.badges?.length || 0}</div>
                        <div style={{ fontSize: '12px', color: '#b2bec3' }}>Badges</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            background: 'white',
                            margin: '0 auto 5px',
                            border: '2px solid #6c5ce7'
                        }}>
                            <img
                                src={user?.avatar ? `src/assets/avatars/${user.avatar}.png` : ''}
                                alt="Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.6)' }}
                            />
                        </div>
                        <div style={{ fontSize: '12px', color: '#b2bec3' }}>Current Hero</div>
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        onClick={onPlayAgain}
                        style={buttonStyle('#6c5ce7')}
                    >
                        Play Again
                    </button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={onBackToMap}
                            style={{ ...buttonStyle('#a29bfe'), flex: 1 }}
                        >
                            Back to Map
                        </button>
                        <button
                            onClick={onShowLeaderboard}
                            style={{ ...buttonStyle('#fab1a0'), flex: 1 }}
                        >
                            Leaderboard
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes popIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
