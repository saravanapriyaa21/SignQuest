# **SignQuest**

**SignQuest** is a gamified web platform that turns learning sign language into an adventure instead of a chore.
Learners travel across a colorful world map, unlock new “lands,” and practice signs through interactive quizzes and challenges.

Guiding them along the way is **Ziggy**, an animated mentor who celebrates correct answers, gives hints, and keeps motivation high. The goal is simple: make sign language learning accessible, engaging, and fun for all ages.

---

## **Features**

* Gamified world map with unlockable learning lands
* Animated mentor (Ziggy) providing feedback and encouragement
* Video-based sign demonstrations
* Quiz system with streak tracking and XP
* Persistent user progress using MongoDB
* Leaderboard with top learners
* Unlockable avatars and progression system
* Accessibility-focused UI for beginners and young learners

---

## **Tech Stack**

### **Frontend**

* React
* Vite
* JavaScript
* CSS

### **Backend**

* Node.js
* Express
* MongoDB

### **Tools & Deployment**

* Git & GitHub
* Render

---

## **How It Works**

Each “land” represents a learning level containing a set of signs.

Users:

1. Learn signs through looping demonstration videos
2. Take quizzes to reinforce recognition
3. Earn XP and maintain streaks
4. Unlock new lands and avatars
5. Save progress persistently through the backend

The frontend communicates with a Node/Express API to store and retrieve user data, enabling persistent learning across sessions. The system is structured so new signs, lands, and features can be added easily by extending simple data files.

---

## **Future Improvements**

* More quiz modes (matching, fill-in-the-blank, drag-and-drop)
* More sign categories and languages
* Mobile-optimized version
* Optional AI sign recognition practice
* Classroom and accessibility program integrations

---

## **Mission**

To make communication more inclusive by helping more people learn sign language in a way that feels playful, encouraging, and approachable.

---

## Run Locally

```
git clone https://github.com/saravanapriyaa21/SignQuest.git
cd SignQuest

### Backend
cd backend
npm install

Create .env:
PORT=5050
MONGO_URI=your_mongodb_uri

node server.js

### Frontend
cd ../frontend
npm install

Create .env:
VITE_API_URL=http://localhost:5050/api

npm run dev

Open:
http://localhost:5173

```
---

## **License**

MIT License
