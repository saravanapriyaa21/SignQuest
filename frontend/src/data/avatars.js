export const AVATARS = [
    {
        id: "nova",
        name: "Nova",
        fullName: "Nova (Explorer Learner)",
        img: "nova",
        unlockXP: 0, // Starter Avatar
        description: "Nova loves discovering new ways to communicate. Curious and energetic, Nova represents learners who enjoy exploring each land and unlocking new signs step by step.",
        vibe: "Bright colors, backpack or explorer feel, mid-sign pose.",
        represents: "Curiosity and progress."
    },
    {
        id: "kai",
        name: "Kai",
        fullName: "Kai (Confident Communicator)",
        img: "kai",
        unlockXP: 0, // Default
        description: "Kai enjoys connecting with others through sign language and practicing every day. Confident and friendly, Kai represents learners growing more comfortable expressing themselves.",
        vibe: "Relaxed pose, expressive hands, warm smile.",
        represents: "Confidence and communication."
    },
    {
        id: "leo",
        name: "Leo",
        fullName: "Leo the Fox (Playful Learner)",
        img: "leo",
        unlockXP: 50, // Reached mid-World 1
        description: "Leo is playful and quick to learn new signs. Always excited to try again after mistakes, Leo reminds learners that practice makes progress.",
        vibe: "Friendly fox character, simple and expressive.",
        represents: "Fun and persistence."
    },
    {
        id: "luna",
        name: "Luna",
        fullName: "Luna the Owl (Focused Learner)",
        img: "luna",
        unlockXP: 150, // Reached mid-World 2
        description: "Luna practices each sign carefully and thoughtfully. With steady focus and determination, Luna represents learners who enjoy mastering skills step by step.",
        vibe: "Owl character, calm expression.",
        represents: "Focus and steady growth."
    },
    {
        id: "mira",
        name: "Mira",
        fullName: "Mira (Supportive Friend)",
        img: "mira",
        unlockXP: 350, // Reached mid-World 3
        description: "Mira believes learning is better together. Calm and encouraging, Mira celebrates small wins and supports others along the journey of learning new signs.",
        vibe: "Soft colors, gentle expression.",
        represents: "Patience and empathy."
    },
    {
        id: "star",
        name: "Star",
        fullName: "Star Avatar",
        img: "star",
        unlockXP: 450, // Approx total after 3 worlds
        description: "The Star avatar is unlocked after completing 3 worlds! It represents dedication, growth, and the excitement of mastering new signs.",
        vibe: "Glowing star or silhouette avatar.",
        represents: "Achievement and motivation."
    }
];

export const checkAvatarUnlocks = (stats, unlockedAvatars) => {
    const { xp, unlockedLands } = stats;

    // Find highest priority avatar that SHOULD be unlocked but isn't
    const unlockable = AVATARS.filter(a => {
        if (unlockedAvatars.includes(a.id)) return false;

        if (a.id === 'star') {
            // Unlock strictly after completing 3 worlds (meaning land 4 is now unlocked)
            // Or if they somehow have huge XP, but let's stick to the description.
            return unlockedLands > 3;
        }

        return xp >= a.unlockXP;
    });

    return unlockable.map(a => a.id);
};
