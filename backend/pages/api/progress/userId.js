import { getProgress } from '../../../lib/db';

export default async function handler(req, res) {
  const { userId } = req.query;
  const { videoId } = req.query;

  if (req.method === 'GET') {
    try {
      const progress = await getProgress(userId, videoId);
      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}