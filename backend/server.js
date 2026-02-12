require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");
const leaderboardRoutes = require("./routes/leaderboard");

const app = express(); // ← CREATE APP FIRST

app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.listen(5050, () => console.log("Server running on port 5050"));
