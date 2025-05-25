import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'videoProgressDB'; // Use your actual DB name

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  const { userId, videoId } = req.method === 'GET' ? req.query : req.body;

  if (!userId || !videoId) {
    return res.status(400).json({ error: 'Missing userId or videoId' });
  }

  const client = await connectToDatabase();
  const db = client.db(dbName);
  const collection = db.collection('progress'); // Make sure this is 'progress'

  if (req.method === 'GET') {
    const doc = await collection.findOne({ userId, videoId });
    return res.status(200).json(doc || {});
  }

  if (req.method === 'POST') {
    const { intervals, lastPosition, playCount, completeViews } = req.body;
    await collection.updateOne(
      { userId, videoId },
      { $set: { intervals, lastPosition, playCount, completeViews } },
      { upsert: true }
    );
    return res.status(200).json({ success: true });
  }

  res.status(405).end();
}
