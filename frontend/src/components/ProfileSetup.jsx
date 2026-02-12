import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { AVATARS } from '../data/avatars';

export default function ProfileSetup() {
    const { login } = useUser();
    const [username, setUsername] = useState('');
    const [selectedAvatarId, setSelectedAvatarId] = useState('kai'); // Default to Kai
    const [error, setError] = useState('');
    const [existingUser, setExistingUser] = useState(null);

    const checkUser = async () => {
        if (!username.trim()) return;
        try {
            const res = await fetch(`http://localhost:5050/api/user/${username}`);
            if (res.ok) {
                const data = await res.json();
                setExistingUser(data);
                // If user has the currently selected avatar unlocked, keep it. 
                // If they have it selected in DB, maybe pre-select it?
                // For now, just updating the lock visualization is enough.
                if (data.avatar) setSelectedAvatarId(data.avatar);
            } else {
                setExistingUser(null);
            }
        } catch (e) {
            console.error("Error checking user", e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }
        const success = await login(username, selectedAvatarId);
        if (!success) setError('Something went wrong. Try again.');
    };

    const selectedAvatar = AVATARS.find(a => a.id === selectedAvatarId) || AVATARS[1]; // Fallback to Kai

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #74ebd5 0%, #9face6 100%)',
            fontFamily: '"Comic Sans MS", cursive, sans-serif',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '30px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                textAlign: 'center',
                maxWidth: '900px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px'
            }}>
                <div>
                    <h1 style={{ color: '#6c5ce7', margin: 0, fontSize: '2.5rem' }}>Welcome to SignQuest!</h1>
                    <p style={{ color: '#636e72', fontSize: '1.2rem', marginTop: '10px' }}>
                        Begin your adventure by creating your profile.
                    </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center', alignItems: 'flex-start' }}>

                    {/* Left Column: Input & Selection */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', textAlign: 'left', fontWeight: 'bold', color: '#2d3436', marginBottom: '8px', marginLeft: '5px' }}>
                                    Adventurer Name:
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your username..."
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '15px',
                                        fontSize: '18px',
                                        borderRadius: '15px',
                                        border: '3px solid #dfe6e9',
                                        outline: 'none',
                                        transition: 'border-color 0.3s',
                                        backgroundColor: '#f1f2f6'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#6c5ce7'}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#dfe6e9';
                                        checkUser();
                                    }}
                                />
                            </div>

                            <p style={{ textAlign: 'left', fontWeight: 'bold', color: '#2d3436', marginBottom: '15px', marginLeft: '5px' }}>
                                Choose your Companion:
                            </p>

                            {/* Avatar List (Dock Style) */}
                            <div style={{
                                display: 'flex',
                                gap: '15px',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                background: '#f1f2f6',
                                padding: '15px',
                                borderRadius: '20px'
                            }}>
                                {AVATARS.map(av => {
                                    // Check if avatar is locked
                                    // Default lock logic for new users: anything with XP requirement is locked
                                    let isLocked = av.unlockXP > 0;

                                    // If we have an existing user loaded successfully (via blur/check), use their unlocks
                                    if (existingUser && existingUser.unlockedAvatars) {
                                        isLocked = !existingUser.unlockedAvatars.includes(av.id);
                                    }

                                    return (
                                        <div
                                            key={av.id}
                                            onClick={() => !isLocked && setSelectedAvatarId(av.id)}
                                            title={isLocked ? (av.id === 'star' ? "Locked (Complete 3 Worlds)" : `Locked (Need ${av.unlockXP} XP)`) : av.name}
                                            style={{
                                                cursor: isLocked ? 'not-allowed' : 'pointer',
                                                width: '60px', // Explicit size
                                                height: '60px',
                                                borderRadius: '50%',
                                                border: selectedAvatarId === av.id ? '4px solid #6c5ce7' : '4px solid transparent',
                                                transition: 'all 0.2s',
                                                transform: selectedAvatarId === av.id ? 'scale(1.15) translateY(-5px)' : 'scale(1)',
                                                overflow: 'hidden', // Crop the zoomed image
                                                position: 'relative',
                                                boxShadow: selectedAvatarId === av.id ? '0 5px 15px rgba(108, 92, 231, 0.3)' : 'none',
                                                opacity: isLocked ? 0.6 : 1,
                                                filter: isLocked ? 'grayscale(100%)' : (selectedAvatarId === av.id ? 'none' : 'grayscale(30%)')
                                            }}
                                        >
                                            <img
                                                src={`/avatars/${av.img}.png`}
                                                alt={av.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    display: 'block',
                                                    transform: 'scale(1.6)' // Keep the aggressive zoom
                                                }}
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + av.id; }}
                                            />
                                            {isLocked && (
                                                <div style={{
                                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: 'rgba(0,0,0,0.4)', color: 'white', fontSize: '20px'
                                                }}>
                                                    🔒
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {error && <p style={{ color: '#e74c3c', marginTop: '20px', fontWeight: 'bold' }}>{error}</p>}

                            <button
                                type="submit"
                                style={{
                                    marginTop: '30px',
                                    background: 'linear-gradient(145deg, #6c5ce7, #a29bfe)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '18px 50px',
                                    fontSize: '22px',
                                    fontWeight: 'bold',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 15px rgba(108, 92, 231, 0.4)',
                                    transition: 'transform 0.2s',
                                    width: '100%'
                                }}
                                onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                Start Adventure!
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Avatar Details */}
                    <div style={{
                        flex: 1,
                        minWidth: '300px',
                        background: '#f8f9fa',
                        padding: '30px',
                        borderRadius: '25px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        border: '4px solid #dfe6e9'
                    }}>
                        <div style={{
                            width: '280px',
                            height: '280px',
                            borderRadius: '50%',
                            border: '8px solid #6c5ce7',
                            boxShadow: '0 10px 40px rgba(108, 92, 231, 0.4)',
                            marginBottom: '20px',
                            overflow: 'hidden',
                            position: 'relative',
                            background: 'transparent' // Removed white background
                        }}>
                            <img
                                src={`/avatars/${selectedAvatar.img}.png`}
                                alt={selectedAvatar.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover', // Ensures it fills the circle
                                    display: 'block',
                                    transform: 'scale(1.6)' // Aggressive zoom to remove artifacts
                                }}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + selectedAvatar.id; }}
                            />
                        </div>

                        <h2 style={{ color: '#2d3436', margin: '0 0 10px 0', fontSize: '1.8rem' }}>
                            {selectedAvatar.fullName}
                        </h2>

                        <div style={{ textAlign: 'left', width: '100%' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <strong style={{ color: '#6c5ce7', display: 'block', marginBottom: '5px' }}>Description:</strong>
                                <p style={{ color: '#636e72', margin: 0, lineHeight: '1.5' }}>
                                    {selectedAvatar.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
