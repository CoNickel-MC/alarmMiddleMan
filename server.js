const express = require('express');
const { MongoClient } = require('mongodb');const app = express();
app.use(express.json());

const uri = "YOUR_MONGODB_CONNECTION_STRING";
const client = new MongoClient(uri);

// Update streak
app.post('/update-streak', async (req, res) => {
    const { username, streak } = req.body;
    const db = client.db("nosnooze");
    await db.collection("leaderboard").updateOne(
        { username },
        { $set: { streak } },
        { upsert: true }
    );
    res.sendStatus(200);
});

// Get Top 10 Leaderboard
app.get('/leaderboard', async (req, res) => {
    const db = client.db("nosnooze");
    const topUsers = await db.collection("leaderboard")
        .find().sort({ streak: -1 }).limit(10).toArray();
    res.json(topUsers);
});

app.listen(3000, () => console.log('Server running on port 3000'));