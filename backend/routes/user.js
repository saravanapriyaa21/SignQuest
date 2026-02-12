const router = require("express").Router();
const User = require("../models/User");

// Login or Create User
router.post("/login", async (req, res) => {
  const { username, avatar } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = await User.create({
        username,
        avatar: avatar || 'kai',
        unlockedAvatars: ['kai', 'nova'] // Default unlocked Kai and Nova
      });
    } else {
      // Update last login
      user.lastLogin = Date.now();
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Profile
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Progress (XP, Level, Streak, Badges)
router.post("/update-progress", async (req, res) => {
  const { username, xp, level, streak, badges, unlockedLands } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (xp !== undefined) user.xp = xp;
    if (unlockedLands !== undefined) {
      if (unlockedLands > user.unlockedLands) user.unlockedLands = unlockedLands;
    }
    // Fallback if legacy code sends just 'level'
    if (level !== undefined && level > user.unlockedLands) user.unlockedLands = level;

    if (level !== undefined) user.level = level; // Current land
    if (streak !== undefined) {
      user.streak = streak;
      if (streak > user.bestStreak) user.bestStreak = streak;
    }

    // Add new badges if not already earned
    if (badges && badges.length > 0) {
      badges.forEach(newBadgeId => {
        if (!user.badges.some(b => b.id === newBadgeId)) {
          user.badges.push({ id: newBadgeId });
        }
      });
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buy Hint (Deduct XP)
router.post("/buy-hint", async (req, res) => {
  const { username, cost } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.xp >= cost) {
      user.xp -= cost;
      await user.save();
      res.json({ success: true, xp: user.xp });
    } else {
      res.status(400).json({ error: "Not enough XP" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unlock Avatar
router.post("/unlock-avatar", async (req, res) => {
  const { username, avatarId } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.unlockedAvatars.includes(avatarId)) {
      user.unlockedAvatars.push(avatarId);
      await user.save();
    }
    res.json({ success: true, unlockedAvatars: user.unlockedAvatars });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Current Avatar
router.post("/update-avatar", async (req, res) => {
  const { username, avatar } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Verify ownership
    if (!user.unlockedAvatars.includes(avatar)) {
      return res.status(400).json({ error: "Avatar not unlocked" });
    }

    user.avatar = avatar;
    await user.save();
    res.json({ success: true, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
