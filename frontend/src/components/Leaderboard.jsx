import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

export default function Leaderboard({ onClose }) {
    const { user } = useUser();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5050/api/leaderboard')
            .then(res => res.json())
            .then(data => {
                setLeaders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

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
                maxWidth: '500px',
                borderRadius: '20px',
                padding: '20px',
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

                <h2 style={{ textAlign: 'center', color: '#ff9f43', marginBottom: '20px' }}>🏆 Leaderboard 🏆</h2>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading champions...</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f1f2f6', color: '#7f8c8d' }}>
                                <th style={{ padding: '10px', textAlign: 'left', borderRadius: '10px 0 0 10px' }}>#</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Adventurer</th>
                                <th style={{ padding: '10px', textAlign: 'right', borderRadius: '0 10px 10px 0' }}>XP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaders.map((leader, index) => {
                                const isMe = user && leader.username === user.username;
                                return (
                                    <tr key={leader._id} style={{
                                        background: isMe ? '#dfe6e9' : 'white',
                                        fontWeight: isMe ? 'bold' : 'normal',
                                        borderBottom: '1px solid #f1f2f6'
                                    }}>
                                        <td style={{ padding: '15px 10px' }}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                        </td>
                                        <td style={{ padding: '15px 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img
                                                src={`src/assets/avatars/${leader.avatar}.png`}
                                                alt={leader.avatar}
                                                style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + leader.avatar; }}
                                            />
                                            {leader.username} {isMe && '(You)'}
                                        </td>
                                        <td style={{ padding: '15px 10px', textAlign: 'right', color: '#e17055' }}>
                                            {leader.xp} XP
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
