// src/App.jsx
import React, { useState, useEffect } from "react";
import Ziggy from "./components/Ziggy";
import ProgressBar from "./components/ProgressBar";
import signs from "./data/signs";
import LANDS from "./data/land";
import { useUser } from "./context/UserContext";
import ProfileSetup from "./components/ProfileSetup";
import Leaderboard from "./components/Leaderboard";
import AvatarSelector from "./components/AvatarSelector";
import Badges from "./components/Badges";
import GameComplete from "./components/GameComplete";
import { checkBadges, BADGES } from "./data/badges";
import { AVATARS, checkAvatarUnlocks } from "./data/avatars";
// Simple Sound Synth
const playSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'success') {
      // Arpeggio
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = freq;
        o.type = 'triangle';
        g.gain.setValueAtTime(0.2, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
        o.start(now + i * 0.1);
        o.stop(now + i * 0.1 + 0.5);
      });
    }
  } catch (e) { console.error("Audio error", e); }
};

export default function App() {
  const { user, loading, updateProgress, buyHint, unlockAvatar } = useUser();
  const [screen, setScreen] = useState("landing"); // landing | learn | quiz | finished
  const [level, setLevel] = useState(1); // current land being played (local state for navigation)
  const [index, setIndex] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0); // Local streak for UI feedback
  const [ziggyAnim, setZiggyAnim] = useState("Idle");
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false); // New State
  const [unlockedNewAvatars, setUnlockedNewAvatars] = useState([]);
  const [unlockedNewBadges, setUnlockedNewBadges] = useState([]);
  const [hasUsedHint, setHasUsedHint] = useState(false);

  const userRef = React.useRef(user);
  const streakRef = React.useRef(sessionStreak);

  // Sync refs with latest state for use in callbacks/timeouts
  useEffect(() => {
    userRef.current = user;
    streakRef.current = sessionStreak;
  }, [user, sessionStreak]);

  // Sync level with user progress on load
  useEffect(() => {
    if (user) {
      // Cap level at maximum available lands to prevent out-of-bounds crashes
      const initialLevel = Math.min(user.unlockedLands || 1, LANDS.length);
      setLevel(initialLevel);
    }
  }, [user]);

  // Retroactive Check for Missed Unlocks (e.g., if criteria met but event missed)
  useEffect(() => {
    if (!user) return;

    const checkMissedUnlocks = async () => {
      const stats = { xp: user.xp, unlockedLands: user.unlockedLands };
      const missedAvatars = checkAvatarUnlocks(stats, user.unlockedAvatars);

      if (missedAvatars.length > 0) {
        console.log("Found missed avatars:", missedAvatars);
        // Unlock them one by one
        for (const avId of missedAvatars) {
          await unlockAvatar(avId);
        }
        // Show notification (deduplicated)
        setUnlockedNewAvatars(prev => {
          const newOnes = missedAvatars.filter(id => !prev.includes(id));
          return [...prev, ...newOnes];
        });
        if (missedAvatars.length > 0) playSound('success');
      }
    };

    checkMissedUnlocks();

    // One-time celebration for Star avatar (if missed by silent unlock)
    if (user.unlockedAvatars.includes('star')) {
      const hasCelebrated = localStorage.getItem(`celebrated_star_${user.username}`);
      if (!hasCelebrated) {
        setUnlockedNewAvatars(prev => [...prev, 'star']);
        localStorage.setItem(`celebrated_star_${user.username}`, 'true');
        playSound('success');
      }
    }
    // eslint-disable-next-line
  }, [user]); // Run when user state updates (safely handles null)

  // Keyboard shortcuts (Moved up for Rules of Hooks)
  useEffect(() => {
    function onKey(e) {
      if (screen !== "quiz") return;
      const keys = ["1", "2", "3", "4"];
      const idx = keys.indexOf(e.key);
      if (idx >= 0) {
        const opt = getOptions()[idx];
        if (opt) checkAnswer(opt);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, index, level]);

  if (loading) return <div className="loading">Loading adventure...</div>;
  if (!user) return <ProfileSetup />;

  const currentSet = signs.filter((s) => s.land === level) || [];
  const total = currentSet.length || 1; // Defensive: prevent division by zero
  const current = currentSet[index] || null;

  // Move to next sign in Learn mode
  function nextLearn() {
    if (index + 1 < total) {
      setIndex(i => i + 1);
      setMessage("");
    } else {
      setMessage(`You finished learning ${LANDS[level - 1].name}! Time for the quiz.`);
    }
  }

  // Move to next question in Quiz or finish land
  function nextQuiz() {
    if (index + 1 < total) {
      setIndex(i => i + 1);
      setMessage("");
      setHint("");
    } else {
      finishLand();
    }
  }

  async function finishLand() {
    setScreen("finished");
    setMessage(`You completed ${LANDS[level - 1].name}!`);
    setTimeout(() => setZiggyAnim("Idle"), 1000);

    // Use Refs to get latest state inside timeout/callback
    const currentUser = userRef.current;
    const currentStreak = streakRef.current;

    // Calculate rewards
    const xpGain = 50;
    const newUnlockedLands = Math.max(currentUser.unlockedLands, level + 1);

    // Create a projected user object with new stats for badge checking
    const projectedUser = {
      ...currentUser,
      unlockedLands: newUnlockedLands,
      xp: currentUser.xp + xpGain
      // Note: bestStreak logic is handled by backend usually, but for local check we use currentStreak
    };

    // Check for badge updates
    const newBadges = checkBadges(projectedUser, { streak: currentStreak, hasUsedHint });
    if (newBadges.length > 0) {
      setUnlockedNewBadges(prev => [...prev, ...newBadges]);
    }

    // Check for Avatar Unlocks
    const currentTotalXp = currentUser.xp + xpGain;
    const unlockedAvatarIds = checkAvatarUnlocks(
      { xp: currentTotalXp, unlockedLands: newUnlockedLands },
      currentUser.unlockedAvatars
    );

    if (unlockedAvatarIds.length > 0) {
      for (const avId of unlockedAvatarIds) {
        await unlockAvatar(avId);
      }
      setUnlockedNewAvatars(prev => [...prev, ...unlockedAvatarIds]);
      playSound('success');
    }

    // Save progress to backend
    await updateProgress({
      xp: currentUser.xp + xpGain,
      unlockedLands: newUnlockedLands,
      streak: currentStreak, // Passing current streak to update bestStreak logic on backend if higher
      badges: newBadges
    });

    setSessionStreak(0);
    setHasUsedHint(false); // Reset for next land
  }

  function checkAnswer(ans) {
    if (!current) return;
    if (ans === current.word) {
      setZiggyAnim("Cheer");
      setMessage("Correct! +10 XP 🎉");
      playSound('correct');
      setSessionStreak(s => s + 1);

      // Micro-update for XP visualization (optional, or just wait for backend)
      // For responsiveness, we can optimistically add XP here if we wanted, 
      // but let's stick to land completion and hint cost for big updates to avoid spamming backend
      // actually, let's update XP locally for UI fun? usage:
      // Proactive Avatar Unlock Check (Mid-Game)
      const nextXp = user.xp + 10;
      const midGameUnlocks = checkAvatarUnlocks(
        { xp: nextXp, unlockedLands: user.unlockedLands },
        user.unlockedAvatars
      );
      if (midGameUnlocks.length > 0) {
        setUnlockedNewAvatars(prev => {
          const fresh = midGameUnlocks.filter(id => !prev.includes(id));
          return [...prev, ...fresh];
        });
        playSound('success');
      }

      updateProgress({ xp: nextXp, streak: sessionStreak + 1 });

      setTimeout(() => {
        setZiggyAnim("Idle");
        nextQuiz();
      }, 1400);
    } else {
      setZiggyAnim("Point");
      setMessage("Oops — try again! 🤔");
      playSound('wrong');
      setSessionStreak(0);
      updateProgress({ streak: 0 });
      setTimeout(() => setZiggyAnim("Idle"), 1200);
    }
  }

  function useHint() {
    if (hint) return; // Already showing
    if (user.xp < 2) {
      setMessage("Not enough XP for a hint! (Need 2 XP)");
      return;
    }

    buyHint(2).then(success => {
      if (success) {
        setHint(current.hint);
        setMessage("Hint revealed! (-2 XP)");
        setHasUsedHint(true);
      } else {
        setMessage("Not enough XP!");
      }
    });
  }

  function startLesson() {
    setScreen("learn");
    setIndex(0);
    setMessage(`Welcome to ${LANDS[level - 1].name}!`);
    setHint("");
    setHasUsedHint(false);
  }

  function startQuiz() {
    setScreen("quiz");
    setIndex(0);
    setMessage(`Quiz time! Pick the correct sign from ${LANDS[level - 1].name} 🌟`);
    setHint("");
    setHasUsedHint(false);
  }

  function nextLand() {
    if (level < LANDS.length) {
      setLevel(l => l + 1);
      setScreen("landing");
      setIndex(0);
      setMessage("");
      setHint("");
    } else {
      setScreen("gameComplete");
      setMessage("🎉 You completed all lands! Amazing job!");
      setIndex(0);
      setHint("");
    }
  }

  function goHome() {
    setScreen("landing");
    setIndex(0);
    setMessage("");
    setHint("");
  }



  function getOptions() {
    if (!current) return [];
    const pool = currentSet.map(s => s.word).filter(w => w !== current.word);
    shuffle(pool);
    const opts = [current.word, pool[0] || "N/A", pool[1] || "N/A", pool[2] || "N/A"];
    return shuffle([...opts]);
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Kid-friendly button styles (kept same)
  const buttonStyles = {
    primary: {
      background: 'linear-gradient(145deg, #ff6b6b, #ff8e8e)',
      border: '3px solid #ff4757',
      borderRadius: '25px',
      padding: '14px 24px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'white',
      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
      boxShadow: '0 4px 0 #ff4757, 0 8px 15px rgba(255, 107, 107, 0.4)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      transform: 'translateY(0)',
      fontFamily: '"Comic Sans MS", cursive, sans-serif'
    },
    secondary: {
      background: 'linear-gradient(145deg, #48dbfb, #74f2ff)',
      border: '3px solid #0abde3',
      borderRadius: '20px',
      padding: '12px 20px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white',
      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
      boxShadow: '0 3px 0 #0abde3, 0 6px 12px rgba(72, 219, 251, 0.4)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      transform: 'translateY(0)',
      fontFamily: '"Comic Sans MS", cursive, sans-serif'
    },
    success: {
      background: 'linear-gradient(145deg, #1dd1a1, #00d2d3)',
      border: '3px solid #10ac84',
      borderRadius: '20px',
      padding: '12px 20px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white',
      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
      boxShadow: '0 3px 0 #10ac84, 0 6px 12px rgba(29, 209, 161, 0.4)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      transform: 'translateY(0)',
      fontFamily: '"Comic Sans MS", cursive, sans-serif'
    },
    option: {
      background: 'linear-gradient(145deg, #ff9ff3, #f368e0)',
      border: '3px solid #ff6b9d',
      borderRadius: '20px',
      padding: '16px 12px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white',
      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
      boxShadow: '0 3px 0 #ff6b9d, 0 6px 12px rgba(255, 159, 243, 0.4)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      transform: 'translateY(0)',
      flex: '1 1 45%',
      fontFamily: '"Comic Sans MS", cursive, sans-serif',
      minHeight: '60px'
    },
    landButton: {
      background: 'linear-gradient(145deg, #feca57, #ff9f43)',
      border: '3px solid #ff9f43',
      borderRadius: '15px',
      padding: '8px 0',
      fontSize: '14px',
      fontWeight: 'bold',
      color: 'white',
      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
      boxShadow: '0 3px 0 #e67e22, 0 4px 8px rgba(254, 202, 87, 0.4)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      transform: 'translateY(0)',
      width: '100%',
      fontFamily: '"Comic Sans MS", cursive, sans-serif'
    }
  };

  // Map route styles
  const mapStyles = {
    container: {
      position: 'relative',
      width: '100%',
      minHeight: '500px',
      background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 30%, #DEB887 100%)',
      borderRadius: '20px',
      padding: '30px',
      marginTop: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      border: '15px solid #5D4037',
      overflow: 'hidden'
    },
    mapBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(222, 184, 135, 0.3) 0%, transparent 20%),
      radial-gradient(circle at 80% 70%, rgba(222, 184, 135, 0.3) 0%, transparent 20%),
      radial-gradient(circle at 40% 80%, rgba(222, 184, 135, 0.2) 0%, transparent 15%)
      `,
      zIndex: 1
    },
    path: {
      position: 'absolute',
      top: '50%',
      left: '5%',
      width: '90%',
      height: '8px',
      background: 'linear-gradient(to right, #FFD700, #FFA500)',
      borderRadius: '4px',
      boxShadow: '0 0 10px #FFD700, inset 0 0 5px rgba(255, 215, 0, 0.5)',
      zIndex: 2
    },
    pathDots: {
      position: 'absolute',
      top: '50%',
      left: '5%',
      width: '90%',
      height: '8px',
      background: 'transparent',
      zIndex: 3
    },
    landMarker: {
      position: 'absolute',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 4,
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    landImage: {
      width: '140px',
      height: '140px',
      borderRadius: '50%',
      border: '6px solid #FFD700',
      objectFit: 'cover',
      boxShadow: '0 0 20px #FFD700, inset 0 0 15px rgba(255, 215, 0, 0.5)',
      background: 'white',
      transition: 'all 0.3s ease'
    },
    landName: {
      background: 'linear-gradient(145deg, #FF6B6B, #FF8E8E)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '25px',
      fontWeight: 'bold',
      fontSize: '18px',
      marginTop: '12px',
      boxShadow: '0 4px 0 #FF4757',
      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
      fontFamily: '"Comic Sans MS", cursive, sans-serif'
    },
    currentPosition: {
      position: 'absolute',
      top: '50%',
      left: '5%',
      transform: 'translate(-50%, -50%)',
      width: '40px',
      height: '40px',
      background: 'linear-gradient(145deg, #48dbfb, #74f2ff)',
      borderRadius: '50%',
      border: '3px solid #0abde3',
      boxShadow: '0 0 15px #48dbfb',
      zIndex: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      color: 'white'
    }
  };

  const getLandPosition = (landIndex) => {
    const totalLands = LANDS.length;
    const segmentWidth = 90 / (totalLands - 1);
    return 5 + (landIndex * segmentWidth);
  };

  const header = (
    <div className="topbar">
      <div className="title">SignQuest — {screen === 'landing' ? 'Map' : (LANDS[level - 1]?.name || 'Adventure')}</div>
      <div className="meta" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          onClick={() => setShowAvatarSelector(true)} // Click to open selector
          title="Change Avatar"
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid white',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            transition: 'transform 0.2s'
          }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={`src/assets/avatars/${user.avatar}.png`}
              alt="avatar"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.6)' // Zoom to match ProfileSetup
              }}
            />
          </div>
          <span style={{ fontWeight: 'bold' }}>{user.username}</span>
        </div>
        <div title="XP">⭐ <strong>{user.xp}</strong></div>
        <div title="Streak">🔥 <strong>{user.streak}</strong></div>
        <button
          onClick={() => setShowLeaderboard(true)}
          style={{ ...buttonStyles.secondary, padding: '5px 10px', fontSize: '14px' }}
        >
          🏆
        </button>
        <button
          onClick={() => setShowBadges(true)}
          style={{ ...buttonStyles.secondary, padding: '5px 10px', fontSize: '14px' }}
        >
          🏅
        </button>
        <button
          title="Visual Feedback Mode"
          onClick={() => document.body.classList.toggle('high-contrast')}
          style={{ ...buttonStyles.secondary, padding: '5px 10px', fontSize: '14px', background: '#a29bfe', borderColor: '#6c5ce7' }}
        >
          👁️
        </button>
        <button
          onClick={() => { localStorage.removeItem("signquest_username"); window.location.reload(); }}
          style={{ ...buttonStyles.secondary, padding: '5px 10px', fontSize: '12px', background: '#ff7675', borderColor: '#d63031' }}
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="app">
      {header}

      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      {showBadges && <Badges onClose={() => setShowBadges(false)} />}
      {showAvatarSelector && <AvatarSelector onClose={() => setShowAvatarSelector(false)} />}

      {screen === 'gameComplete' && (
        <GameComplete
          user={user}
          onPlayAgain={() => { setLevel(1); setScreen("landing"); }}
          onBackToMap={() => setScreen("landing")}
          onShowLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {unlockedNewBadges.length > 0 && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 2001,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', padding: '40px', borderRadius: '30px', textAlign: 'center',
            animation: 'popIn 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
            border: '6px solid #FFD700',
            boxShadow: '0 0 50px rgba(255, 215, 0, 0.8)'
          }}>
            <h1 style={{ fontSize: '60px', margin: 0 }}>🏆</h1>
            <h2 style={{ color: '#6c5ce7', fontSize: '32px', margin: '10px 0' }}>Badge Unlocked!</h2>

            {(() => {
              const badge = BADGES.find(b => b.id === unlockedNewBadges[0]);
              return badge ? (
                <>
                  <div style={{
                    fontSize: '80px', margin: '20px 0',
                    filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.2))',
                    animation: 'bounce 1s infinite alternate'
                  }}>
                    {badge.icon}
                  </div>
                  <h3 style={{ fontSize: '24px', color: '#2d3436' }}>{badge.name}</h3>
                  <p style={{ color: '#636e72', fontSize: '18px' }}>{badge.description}</p>
                  {unlockedNewBadges.length > 1 && (
                    <p style={{ color: '#0984e3', fontWeight: 'bold', marginTop: '10px' }}>
                      (+{unlockedNewBadges.length - 1} more!)
                    </p>
                  )}
                </>
              ) : null;
            })()}

            <button
              onClick={() => setUnlockedNewBadges(prev => prev.slice(1))}
              style={{
                ...buttonStyles.success,
                marginTop: '30px',
                fontSize: '20px',
                padding: '15px 40px',
                boxShadow: '0 8px 0 #10ac84'
              }}
            >
              Collect!
            </button>
          </div>
        </div>
      )}

      {unlockedNewAvatars.length > 0 && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', animation: 'popIn 0.5s'
          }}>
            <h1 style={{ fontSize: '50px' }}>🎉</h1>
            {(() => {
              const currentId = unlockedNewAvatars[0];
              const isStar = currentId === 'star';
              return (
                <>
                  <h2 style={{ color: '#6c5ce7' }}>
                    {isStar ? "3 Worlds Completed! 🌟" : "New Avatar Unlocked!"}
                  </h2>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '20px auto',
                    borderRadius: '50%',
                    border: '6px solid #FFD700',
                    overflow: 'hidden',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
                  }}>
                    <img
                      src={`src/assets/avatars/${currentId}.png`}
                      alt="Unlock"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scale(1.6)'
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '18px', color: '#636e72', maxWidth: '300px' }}>
                    {isStar
                      ? "You completed 3 worlds, so this Star avatar is unlocked!"
                      : "You can verify it in your collection!"}
                  </p>
                </>
              );
            })()}

            {unlockedNewAvatars.length > 1 && (
              <p style={{ color: '#0984e3', fontWeight: 'bold', marginTop: '5px' }}>
                (+{unlockedNewAvatars.length - 1} more!)
              </p>
            )}

            <button
              onClick={() => setUnlockedNewAvatars(prev => prev.slice(1))}
              style={buttonStyles.success}
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      <div className="main" style={{ display: "flex", gap: "24px" }}>
        <div style={{ flex: screen === "landing" ? 1 : 3 }}>
          {/* Landing Page */}
          {screen === "landing" && (
            <div className="card">
              <h2 style={{ color: '#ff6b6b', textAlign: 'center', fontSize: '2.5em', marginBottom: '20px' }}>
                Map of SignQuest 🗺️
              </h2>
              <p style={{ textAlign: 'center', fontSize: '1.2em', marginBottom: '30px' }}>
                Join Ziggy on an adventure through sign language lands! Follow the golden path to discover new signs.
              </p>

              <div style={mapStyles.container}>
                <div style={mapStyles.mapBackground}></div>
                <div style={mapStyles.path}></div>

                <div style={mapStyles.pathDots}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: `${i * 5}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#FFA500',
                        borderRadius: '50%',
                        boxShadow: '0 0 5px #FFD700'
                      }}
                    ></div>
                  ))}
                </div>

                <div
                  style={{
                    ...mapStyles.currentPosition,
                    left: `${getLandPosition(level - 1)}%`,
                    transition: 'left 0.5s ease'
                  }}
                >
                  {level}
                </div>

                {LANDS.map((landItem, index) => {
                  const position = getLandPosition(index);
                  const isCompleted = user.unlockedLands > landItem.id;
                  const isUnlocked = user.unlockedLands >= landItem.id;
                  const isCurrent = level === landItem.id;

                  return (
                    <div
                      key={landItem.id}
                      style={{
                        ...mapStyles.landMarker,
                        left: `${position}%`,
                        filter: !isUnlocked ? 'grayscale(80%)' : 'none',
                        opacity: !isUnlocked ? 0.7 : 1
                      }}
                      onClick={() => {
                        if (isUnlocked) {
                          setLevel(landItem.id);
                          startLesson();
                        }
                      }}
                    >
                      <img
                        src={landItem.img}
                        alt={landItem.name}
                        style={{
                          ...mapStyles.landImage,
                          borderColor: isCompleted ? '#00D2D3' : isCurrent ? '#FF6B6B' : '#FFD700',
                          cursor: !isUnlocked ? 'not-allowed' : 'pointer'
                        }}
                      />
                      <div style={{
                        ...mapStyles.landName,
                        background: isCompleted
                          ? 'linear-gradient(145deg, #1dd1a1, #00d2d3)'
                          : isCurrent
                            ? 'linear-gradient(145deg, #ff6b6b, #ff8e8e)'
                            : 'linear-gradient(145deg, #feca57, #ff9f43)',
                      }}>
                        {landItem.name}
                        {isCompleted && ' ✓'}
                        {!isUnlocked && ' 🔒'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Learn Section */}
          {screen === "learn" && current && (
            <div className="card">
              <h3 style={{ color: '#48dbfb', textAlign: 'center' }}>Learn: {current.word}</h3>
              <video className="signimg" src={current.video} autoPlay loop muted style={{ width: "100%", borderRadius: "12px" }} />
              <p className="bigword" style={{
                fontSize: '2.5em',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#ff6b6b',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                margin: '20px 0'
              }}>{current.word}</p>
              <div className="controls" style={{ marginTop: "20px", display: "flex", gap: "12px", justifyContent: "center" }}>
                {index + 1 < total ? (
                  <button style={buttonStyles.success} onClick={nextLearn}>
                    ✅ Next Sign
                  </button>
                ) : (
                  <button style={buttonStyles.primary} onClick={startQuiz}>
                    🎯 Take Quiz!
                  </button>
                )}
                <button style={buttonStyles.secondary} onClick={startQuiz}>
                  ⏩ Skip to Quiz
                </button>
                <button
                  style={{ ...buttonStyles.secondary, background: 'linear-gradient(145deg, #a29bfe, #6c5ce7)' }}
                  onClick={goHome}
                >
                  🏠 Back to Map
                </button>
              </div>
            </div>
          )}

          {/* Quiz Section */}
          {screen === "quiz" && current && (
            <div className="card">
              <h3 style={{ color: '#ff9ff3', textAlign: 'center' }}>Which word matches this sign? 🤔</h3>
              <video className="signimg" src={current.video} autoPlay loop muted style={{ width: "100%", borderRadius: "12px" }} />
              <div className="options" style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "20px" }}>
                {getOptions().map((opt, idx) => (
                  <button
                    key={opt}
                    style={buttonStyles.option}
                    onClick={() => checkAnswer(opt)}
                  >
                    {idx + 1}. {opt}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
                <button
                  style={{ ...buttonStyles.secondary, background: 'linear-gradient(145deg, #ffeaa7, #fdcb6e)' }}
                  onClick={useHint}
                >
                  💡 Hint (2 XP)
                </button>
                <button style={buttonStyles.secondary} onClick={goHome}>
                  🏠 Back to Map
                </button>
              </div>
              {hint && (
                <div style={{
                  marginTop: 10,
                  textAlign: 'center',
                  fontStyle: "italic",
                  color: "#d63031",
                  background: '#ffeaa7',
                  padding: '8px 12px',
                  borderRadius: '10px'
                }}>
                  💡 {hint}
                </div>
              )}
            </div>
          )}

          {/* Finished Section */}
          {screen === "finished" && (
            <div className="card">
              <h2 style={{ color: '#00b894', textAlign: 'center', fontSize: '2.2em' }}>
                🎉 Land Completed!
              </h2>
              <div style={{ textAlign: 'center', margin: '30px 0' }}>
                <div style={{ fontSize: '1.5em', marginBottom: '10px' }}>{LANDS[level - 1].name} Conquered!</div>
                <div style={{ fontSize: '1.2em', color: '#636e72' }}>+50 XP Earned</div>
                <div style={{ fontSize: '1.2em', color: '#636e72' }}>Streak: {sessionStreak} 🔥</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  style={buttonStyles.success}
                  onClick={nextLand}
                >
                  🌈 Go to Next Land!
                </button>
                <button
                  style={{ ...buttonStyles.secondary, marginLeft: "12px" }}
                  onClick={goHome}
                >
                  🏠 Back to Map
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        {screen !== "landing" && (
          <div style={{ flex: 1 }}>
            <div className="arena">
              <Ziggy animation={ziggyAnim} position={[0, -1.2, 0]} scale={1.3} />
            </div>
            <div className="message">{message}</div>
            <div style={{ marginTop: 12 }}>
              <ProgressBar
                value={screen === "finished" ? 100 : (index / total) * 100}
                label={`Progress: ${screen === "finished" ? total : index}/${total}`}
              />
            </div>
          </div>
        )}
      </div>

      <footer className="footer">Built for Hackathon • Demo MVP • Ziggy is mentor</footer>
    </div>
  );
}
