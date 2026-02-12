import React from 'react';
import { BADGES } from '../data/badges';
import { useUser } from '../context/UserContext';

export default function Badges({ onClose }) {
    const { user } = useUser();
    const earnedBadgeIds = new Set(user?.badges?.map(b => b.id) || []);

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            fontFamily: '"Comic Sans MS", cursive, sans-serif'
        }}>
            <div style={{
                background: 'white',
                width: '90%',
                maxWidth: '600px',
                borderRadius: '20px',
                padding: '30px',
                maxHeight: '80vh',
                overflowY: 'auto',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer'
                    }}
                >❌</button>

                <h2 style={{ textAlign: 'center', color: '#6c5ce7', marginBottom: '10px' }}>Your Badge Collection 🏅</h2>
                <p style={{ textAlign: 'center', color: '#636e72', marginBottom: '30px' }}>
                    Collecting {earnedBadgeIds.size} / {BADGES.length} badges!
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
                    {BADGES.map(badge => {
                        const isEarned = earnedBadgeIds.has(badge.id);
                        return (
                            <div key={badge.id} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: '15px',
                                borderRadius: '15px',
                                background: isEarned ? '#fff0f3' : '#f1f2f6',
                                border: isEarned ? '2px solid #fd79a8' : '2px solid transparent',
                                opacity: isEarned ? 1 : 0.6,
                                filter: isEarned ? 'none' : 'grayscale(100%)',
                                transition: 'all 0.3s'
                            }}>
                                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{badge.icon}</div>
                                <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>{badge.name}</div>
                                <div style={{ fontSize: '12px', color: '#636e72' }}>{badge.description}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
