import { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUsername = localStorage.getItem("signquest_username");
        if (storedUsername) {
            fetchUser(storedUsername);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (username) => {
        try {
            const res = await fetch(`http://localhost:5050/api/user/${username}`);
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                localStorage.removeItem("signquest_username");
            }
        } catch (err) {
            console.error("Failed to fetch user:", err);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, avatar) => {
        try {
            const res = await fetch("http://localhost:5050/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, avatar }),
            });
            const userData = await res.json();
            if (res.ok) {
                setUser(userData);
                localStorage.setItem("signquest_username", userData.username);
                return true;
            }
        } catch (err) {
            console.error("Login failed:", err);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("signquest_username");
    };

    const updateProgress = async (stats) => {
        if (!user) return;
        // Optimistic update
        const updatedUser = { ...user, ...stats };
        // Merge nested arrays correctly if needed, but for now simple merge
        if (stats.badges) {
            // Dedup badges in optimistic update
            const existingIds = new Set(user.badges.map(b => b.id));
            const newBadges = stats.badges.filter(b => !existingIds.has(b));
            updatedUser.badges = [...user.badges, ...newBadges.map(id => ({ id, date: new Date().toISOString() }))];
        }

        setUser(updatedUser);

        try {
            await fetch("http://localhost:5050/api/user/update-progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username, ...stats }),
            });
            // Re-fetch to ensure sync (optional but safer)
            fetchUser(user.username);
        } catch (err) {
            console.error("Failed to update progress:", err);
            // Revert on failure if needed, or just let next fetch fix it
        }
    };

    const buyHint = async (cost) => {
        if (!user || user.xp < cost) return false;
        setUser(prev => ({ ...prev, xp: prev.xp - cost })); // Optimistic

        try {
            const res = await fetch("http://localhost:5050/api/user/buy-hint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username, cost }),
            });
            return res.ok;
        } catch (err) {
            console.error("Buy hint failed:", err);
            return false;
        }
    };

    const unlockAvatar = async (avatarId) => {
        if (!user) return;
        if (user.unlockedAvatars.includes(avatarId)) return;

        setUser(prev => ({ ...prev, unlockedAvatars: [...prev.unlockedAvatars, avatarId] }));

        try {
            await fetch("http://localhost:5050/api/user/unlock-avatar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username, avatarId }),
            });
        } catch (err) {
            console.error("Unlock avatar failed", err);
        }
    };

    const updateAvatar = async (avatarId) => {
        if (!user) return;
        // Optimistic update
        setUser(prev => ({ ...prev, avatar: avatarId }));

        try {
            const res = await fetch("http://localhost:5050/api/user/update-avatar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username, avatar: avatarId }),
            });
            if (!res.ok) {
                // Revert if failed (optional, but good practice)
                console.error("Failed to update avatar on server");
            }
        } catch (err) {
            console.error("Update avatar failed", err);
        }
    };

    return (
        <UserContext.Provider value={{ user, loading, login, logout, updateProgress, buyHint, unlockAvatar, updateAvatar }}>
            {children}
        </UserContext.Provider>
    );
};
