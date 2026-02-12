const router = require("express").Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  const top = await User.find().sort({ xp: -1 }).limit(10);
  res.json(top);
});

module.exports = router;
