export const BADGES = [
    {
        id: "first_steps",
        name: "First Steps",
        description: "Complete your first land.",
        icon: "🌱"
    },
    {
        id: "high_fiver",
        name: "High Fiver",
        description: "Reach a 5-question streak.",
        icon: "✋"
    },
    {
        id: "xp_warrior",
        name: "XP Warrior",
        description: "Earn 100 XP.",
        icon: "⚔️"
    },
    {
        id: "hint_master",
        name: "Hint Master",
        description: "Complete a quiz without using hints.",
        icon: "🧠" // Logic for this might need extra state tracking in Quiz component
    },
    {
        id: "globetrotter",
        name: "Globetrotter",
        description: "Unlock all lands.",
        icon: "🌍"
    },
    {
        id: "persistent_learner",
        name: "Persistent Learner",
        description: "Log in 3 days in a row.", // Harder to track without daily login logic, maybe skip for MVP or just fake it/simplify
        icon: "📅"
    }
];

export const checkBadges = (user, currentSessionStats) => {
    const newBadges = [];
    const currentBadgeIds = new Set(user.badges.map(b => b.id));

    // 1. First Steps
    // If the projected user has unlocked lands > 1, it means they completed land 1 and unlocked land 2.
    if (!currentBadgeIds.has("first_steps") && user.unlockedLands > 1) {
        newBadges.push("first_steps");
    }

    // 2. High Fiver
    if (!currentBadgeIds.has("high_fiver") && (user.bestStreak >= 5 || currentSessionStats.streak >= 5)) {
        newBadges.push("high_fiver");
    }

    // 3. XP Warrior
    if (!currentBadgeIds.has("xp_warrior") && user.xp >= 100) {
        newBadges.push("xp_warrior");
    }

    // 4. Globetrotter (5 lands total)
    // unlockedLands starts at 1. If completed all 5, unlockedLands will be 6.
    if (!currentBadgeIds.has("globetrotter") && user.unlockedLands > 5) {
        newBadges.push("globetrotter");
    }

    // 5. Hint Master
    if (!currentBadgeIds.has("hint_master") && !currentSessionStats.hasUsedHint) {
        newBadges.push("hint_master");
    }

    return newBadges;
};
