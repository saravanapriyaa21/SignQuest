import React from 'react';
import { AVATARS } from '../data/avatars';
import { useUser } from '../context/UserContext';

export default function AvatarSelector({ onClose }) {
    const { user, updateAvatar } = useUser();

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '30px',
                width: '90%',
                maxWidth: '600px',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '8px solid #a29bfe',
                position: 'relative',
                animation: 'popIn 0.3s ease-out'
            }} onClick={e => e.stopPropagation()}>

                <h2 style={{
                    color: '#6c5ce7',
                    fontFamily: '"Comic Sans MS", cursive',
                    fontSize: '2rem',
                    marginBottom: '20px'
                }}>Choose Your Look! 🎭</h2>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    justifyContent: 'center',
                    padding: '10px'
                }}>
                    {AVATARS.map(av => {
                        const isUnlocked = user.unlockedAvatars.includes(av.id);
                        const isSelected = user.avatar === av.id;

                        return (
                            <div
                                key={av.id}
                                onClick={() => {
                                    if (isUnlocked) {
                                        updateAvatar(av.id);
                                        onClose();
                                    }
                                }}
                                style={{
                                    width: '100px',
                                    height: '120px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                    opacity: isUnlocked ? 1 : 0.6,
                                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    border: isSelected ? '4px solid #6c5ce7' : '4px solid transparent',
                                    boxShadow: isSelected ? '0 0 15px #6c5ce7' : 'none',
                                    overflow: 'hidden',
                                    background: '#dfe6e9',
                                    marginBottom: '10px',
                                    position: 'relative'
                                }}>
                                    <img
                                        src={`/avatars/${av.img}.png`}
                                        alt={av.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transform: 'scale(1.6)', // Maintain zoom consistency
                                            filter: isUnlocked ? 'none' : 'grayscale(100%)'
                                        }}
                                    />
                                    {!isUnlocked && (
                                        <div style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            background: 'rgba(0,0,0,0.5)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'white', fontSize: '24px'
                                        }}>🔒</div>
                                    )}
                                </div>
                                <span style={{
                                    fontWeight: 'bold',
                                    color: isSelected ? '#6c5ce7' : '#2d3436',
                                    fontSize: '14px'
                                }}>
                                    {av.name}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={onClose}
                    style={{
                        marginTop: '30px',
                        background: '#ff7675',
                        color: 'white',
                        border: 'none',
                        padding: '10px 30px',
                        borderRadius: '20px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontFamily: '"Comic Sans MS", cursive'
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
