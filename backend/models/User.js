const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  avatar: { type: String, default: 'kai' }, // Default avatar
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }, // Current Land
  streak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  unlockedLands: { type: Number, default: 1 },
  badges: [{
    id: String,
    date: { type: Date, default: Date.now }
  }],
  unlockedAvatars: { type: [String], default: ['kai', 'leo', 'luna', 'mira', 'nova', 'star'] }, // Starts with all or specific defaults
  lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
