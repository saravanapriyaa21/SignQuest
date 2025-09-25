// src/App.jsx
import React, { useState, useEffect } from "react";
import Ziggy from "./components/Ziggy";
import ProgressBar from "./components/ProgressBar";
import signs from "./data/signs";
import LANDS from "./data/land"; 

export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | learn | quiz | finished
  const [level, setLevel] = useState(1); // current land
  const [index, setIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [ziggyAnim, setZiggyAnim] = useState("Idle");
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState("");

  const currentSet = signs.filter((s) => s.land === level);
  const total = currentSet.length;
  const current = currentSet[index];

  // Move to next sign in Learn mode
  function nextLearn() {
    if (index + 1 < total) setIndex(i => i + 1), setMessage("");
    else setMessage(`You finished learning ${LANDS[level - 1].name}! Time for the quiz.`);
  }

  // Move to next question in Quiz or finish land
  function nextQuiz() {
    if (index + 1 < total) setIndex(i => i + 1), setMessage(""), setHint("");
    else {
      setScreen("finished");
      setMessage(`You completed ${LANDS[level - 1].name}!`);
      setXp(x => x + 50);
      setStreak(0);
      setTimeout(() => setZiggyAnim("Idle"), 1000);
    }
  }

  function checkAnswer(ans) {
    if (!current) return;
    if (ans === current.word) {
      setZiggyAnim("Cheer");
      setMessage("Correct! +10 XP 🎉");
      setXp(x => x + 10);
      setStreak(s => s + 1);
      setTimeout(() => {
        setZiggyAnim("Idle");
        nextQuiz();
      }, 1400);
    } else {
      setZiggyAnim("Point");
      setMessage("Oops — try again! 🤔");
      setStreak(0);
      setTimeout(() => setZiggyAnim("Idle"), 1200);
    }
  }

  function startLesson() {
    setScreen("learn");
    setIndex(0);
    setMessage(`Welcome to ${LANDS[level - 1].name}!`);
    setHint("");
  }

  function startQuiz() {
    setScreen("quiz");
    setIndex(0);
    setMessage(`Quiz time! Pick the correct sign from ${LANDS[level - 1].name} 🌟`);
    setHint("");
  }

  function nextLand() {
    if (level < LANDS.length) setLevel(l => l + 1), setScreen("landing"), setIndex(0), setMessage(""), setHint("");
    else {
      setMessage("🎉 You completed all lands! Amazing job!");
      setScreen("landing");
      setLevel(1);
      setIndex(0);
      setXp(0);
      setStreak(0);
      setHint("");
    }
  }

  // Go back to landing
  function goHome() {
    setScreen("landing");
    setIndex(0);
    setMessage("");
    setHint("");
  }

  // Keyboard shortcuts
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

  // Kid-friendly button styles
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
      width: '140px', // Increased from 120px
      height: '140px', // Increased from 120px
      borderRadius: '50%',
      border: '6px solid #FFD700', // Thicker border
      objectFit: 'cover',
      boxShadow: '0 0 20px #FFD700, inset 0 0 15px rgba(255, 215, 0, 0.5)', // Enhanced shadow
      background: 'white',
      transition: 'all 0.3s ease'
    },
    landName: {
      background: 'linear-gradient(145deg, #FF6B6B, #FF8E8E)',
      color: 'white',
      padding: '10px 20px', // Increased padding
      borderRadius: '25px',
      fontWeight: 'bold',
      fontSize: '18px', // Larger font
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

  // Calculate positions for lands along the path
  const getLandPosition = (landIndex) => {
    const totalLands = LANDS.length;
    const segmentWidth = 90 / (totalLands - 1); // Percentage width between lands
    return 5 + (landIndex * segmentWidth); // Start at 5% from left
  };

  const header = (
    <div className="topbar">
      <div className="title">SignQuest — {LANDS[level - 1].name}</div>
      <div className="meta">
        <div>XP: <strong>{xp}</strong></div>
        <div>Streak: <strong>{streak}</strong></div>
      </div>
    </div>
  );

  return (
    <div className="app">
      {header}
      <div className="main" style={{ display: "flex", gap: "24px" }}>
        <div style={{ flex: screen === "landing" ? 1 : 3 }}>
          {/* Landing Page */}
          {screen === "landing" && (
            <div className="card">
              <h2 style={{ color: '#ff6b6b', textAlign: 'center', fontSize: '2.5em', marginBottom: '20px' }}>
                Welcome to SignQuest! 🗺️
              </h2>
              <p style={{ textAlign: 'center', fontSize: '1.2em', marginBottom: '30px' }}>
                Join Ziggy on an adventure through sign language lands! Follow the golden path to discover new signs.
              </p>
              
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <button 
                  style={buttonStyles.primary}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 0 #ff4757, 0 12px 20px rgba(255, 107, 107, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 0 #ff4757, 0 8px 15px rgba(255, 107, 107, 0.4)';
                  }}
                  onMouseDown={(e) => {
                    e.target.style.transform = 'translateY(1px)';
                    e.target.style.boxShadow = '0 2px 0 #ff4757, 0 4px 8px rgba(255, 107, 107, 0.4)';
                  }}
                  onMouseUp={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 0 #ff4757, 0 12px 20px rgba(255, 107, 107, 0.6)';
                  }}
                  onClick={startLesson}
                >
                  Start Learning Adventure!
                </button>
              </div>

              {/* Pirate Map Route */}
              <div style={mapStyles.container}>
                <div style={mapStyles.mapBackground}></div>
                
                {/* Golden Path */}
                <div style={mapStyles.path}></div>
                
                {/* Path Dots */}
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
                
                {/* Current Position Indicator */}
                <div 
                  style={{
                    ...mapStyles.currentPosition,
                    left: `${getLandPosition(level-1)}%`,
                    transition: 'left 0.5s ease'
                  }}
                >
                  {level}
                </div>
                
                {/* Land Markers */}
                {LANDS.map((landItem, index) => {
                  const position = getLandPosition(index);
                  const isCompleted = landItem.id < level;
                  const isCurrent = landItem.id === level;
                  const isLocked = landItem.id > level;
                  
                  return (
                    <div 
                      key={landItem.id}
                      style={{
                        ...mapStyles.landMarker,
                        left: `${position}%`,
                        filter: isLocked ? 'grayscale(80%)' : 'none',
                        opacity: isLocked ? 0.7 : 1
                      }}
                      onMouseOver={(e) => {
                        if (!isLocked) {
                          e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                          e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
                          e.currentTarget.querySelector('img').style.boxShadow = '0 0 25px #FFD700';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isLocked) {
                          e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                          e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                          e.currentTarget.querySelector('img').style.boxShadow = '0 0 20px #FFD700';
                        }
                      }}
                      onClick={() => {
                        if (!isLocked) {
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
                          cursor: isLocked ? 'not-allowed' : 'pointer'
                        }}
                      />
                      <div style={{
                        ...mapStyles.landName,
                        background: isCompleted 
                          ? 'linear-gradient(145deg, #1dd1a1, #00d2d3)' 
                          : isCurrent 
                            ? 'linear-gradient(145deg, #ff6b6b, #ff8e8e)'
                            : 'linear-gradient(145deg, #feca57, #ff9f43)',
                        boxShadow: isCompleted 
                          ? '0 4px 0 #10ac84' 
                          : isCurrent 
                            ? '0 4px 0 #ff4757'
                            : '0 4px 0 #e67e22'
                      }}>
                        {landItem.name}
                        {isCompleted && ' ✓'}
                        {isLocked && ' 🔒'}
                      </div>
                    </div>
                  );
                })}
                
                {/* Map Decorations */}
                <div style={{
                  position: 'absolute',
                  top: '20%',
                  left: '15%',
                  fontSize: '30px',
                  transform: 'rotate(-10deg)'
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  top: '70%',
                  left: '25%',
                  fontSize: '30px',
                  transform: 'rotate(5deg)'
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  top: '30%',
                  left: '75%',
                  fontSize: '30px',
                  transform: 'rotate(15deg)'
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  top: '80%',
                  left: '85%',
                  fontSize: '30px'
                }}></div>
              </div>

              <div style={{ 
                textAlign: 'center', 
                marginTop: '20px', 
                fontStyle: 'italic',
                color: '#7f8c8d'
              }}>
                Follow the golden path! Complete each land to unlock the next one. 🗝️
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
                  <button 
                    style={buttonStyles.success}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 5px 0 #10ac84, 0 10px 18px rgba(29, 209, 161, 0.6)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 3px 0 #10ac84, 0 6px 12px rgba(29, 209, 161, 0.4)';
                    }}
                    onClick={nextLearn}
                  >
                    ✅ Next Sign
                  </button>
                ) : (
                  <button 
                    style={buttonStyles.primary}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 0 #ff4757, 0 12px 20px rgba(255, 107, 107, 0.6)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 0 #ff4757, 0 8px 15px rgba(255, 107, 107, 0.4)';
                    }}
                    onClick={startQuiz}
                  >
                    🎯 Take Quiz!
                  </button>
                )}
                <button 
                  style={buttonStyles.secondary}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 5px 0 #0abde3, 0 10px 18px rgba(72, 219, 251, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 0 #0abde3, 0 6px 12px rgba(72, 219, 251, 0.4)';
                  }}
                  onClick={startQuiz}
                >
                  ⏩ Skip to Quiz
                </button>
                <button 
                  style={{...buttonStyles.secondary, background: 'linear-gradient(145deg, #a29bfe, #6c5ce7)'}}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 5px 0 #5f4fcf, 0 10px 18px rgba(162, 155, 254, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 0 #5f4fcf, 0 6px 12px rgba(162, 155, 254, 0.4)';
                  }}
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
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 5px 0 #ff6b9d, 0 10px 20px rgba(255, 159, 243, 0.6)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 3px 0 #ff6b9d, 0 6px 12px rgba(255, 159, 243, 0.4)';
                    }}
                    onMouseDown={(e) => {
                      e.target.style.transform = 'translateY(2px)';
                      e.target.style.boxShadow = '0 1px 0 #ff6b9d, 0 2px 8px rgba(255, 159, 243, 0.4)';
                    }}
                    onMouseUp={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 5px 0 #ff6b9d, 0 10px 20px rgba(255, 159, 243, 0.6)';
                    }}
                    onClick={() => checkAnswer(opt)}
                  >
                    {idx + 1}. {opt}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
                <button 
                  style={{...buttonStyles.secondary, background: 'linear-gradient(145deg, #ffeaa7, #fdcb6e)'}}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 5px 0 #e17055, 0 10px 18px rgba(255, 234, 167, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 0 #e17055, 0 6px 12px rgba(255, 234, 167, 0.4)';
                  }}
                  onClick={() => setHint(current.hint)}
                >
                  💡 Hint
                </button>
                <button 
                  style={buttonStyles.secondary}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 5px 0 #0abde3, 0 10px 18px rgba(72, 219, 251, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 0 #0abde3, 0 6px 12px rgba(72, 219, 251, 0.4)';
                  }}
                  onClick={() => { setScreen("learn"); setMessage("Back to learning"); }}
                >
                  📚 Back to Learn
                </button>
                <button 
                  style={{...buttonStyles.secondary, background: 'linear-gradient(145deg, #fd79a8, #e84393)'}}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 5px 0 #c2366d, 0 10px 18px rgba(253, 121, 168, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 0 #c2366d, 0 6px 12px rgba(253, 121, 168, 0.4)';
                  }}
                  onClick={goHome}
                >
                  🏠 Back to Map
                </button>
                {hint && (
                  <div style={{ 
                    marginLeft: 12, 
                    fontStyle: "italic", 
                    color: "#d63031",
                    background: '#ffeaa7',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '2px dashed #fdcb6e'
                  }}>
                    💡 {hint}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Finished Section */}
          {screen === "finished" && (
            <div className="card">
              <h2 style={{ color: '#00b894', textAlign: 'center', fontSize: '2.2em' }}>
                🎉 Completed {LANDS[level - 1].name}!
              </h2>
              <p style={{ textAlign: 'center', fontSize: '1.3em', margin: '20px 0' }}>{message}</p>
              <div style={{ textAlign: 'center' }}>
                <button 
                  style={buttonStyles.success}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 5px 0 #10ac84, 0 10px 18px rgba(29, 209, 161, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 0 #10ac84, 0 6px 12px rgba(29, 209, 161, 0.4)';
                  }}
                  onClick={nextLand}
                >
                  🌈 Go to Next Land!
                </button>
                <button 
                  style={{...buttonStyles.secondary, marginLeft: "12px" }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 5px 0 #0abde3, 0 10px 18px rgba(72, 219, 251, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 0 #0abde3, 0 6px 12px rgba(72, 219, 251, 0.4)';
                  }}
                  onClick={goHome}
                >
                  🏠 Back to Map
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Ziggy & Progress - Conditionally Rendered */}
        {screen !== "landing" && (
          <div style={{ flex: 1 }}>
            <div className="arena">
              <Ziggy animation={ziggyAnim} position={[0, -1.2, 0]} scale={1.3} />
            </div>
            <div className="message">{message}</div>
            <div style={{ marginTop: 12 }}>
              <ProgressBar value={(streak / total) * 100} label={`Streak Progress: ${streak}/${total}`} />
            </div>
          </div>
        )}
      </div>

      <footer className="footer">Built for Hackathon • Demo MVP • Ziggy is mentor</footer>
    </div>
  );
}
    



