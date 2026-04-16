import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

let client;
let db;

async function connectDB() {
if (!client) {
client = new MongoClient(uri);
await client.connect();
db = client.db("nosnooze");
}
return db;
}

export default async function handler(req, res) {
try {
const db = await connectDB();

// POST → update streak
if (req.method === 'POST') {
const { username, streak } = req.body;

if (!username || streak === undefined) {
return res.status(400).json({ error: "Missing fields" });
}

await db.collection("leaderboard").updateOne(
{ username },
{ $set: { streak } },
{ upsert: true }
);

return res.status(200).json({ success: true });
}

// GET → fetch leaderboard
if (req.method === 'GET') {
const topUsers = await db.collection("leaderboard")
.find()
.sort({ streak: -1 })
.limit(10)
.toArray();

return res.status(200).json(topUsers);
}

return res.status(405).end();

} catch (err) {
console.error(err);
return res.status(500).json({ error: "Internal Server Error" });
}
}