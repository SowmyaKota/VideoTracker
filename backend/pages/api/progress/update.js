import { updateProgress } from '../../lib/db';
import { mergeIntervals, calculateProgress } from '../../lib/intervalMerger';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { userId, videoId, watchedInterval, videoDuration, currentTime } = req.body;

      // Get existing progress
      const existingProgress = await getProgress(userId, videoId);
      
      // Merge new interval with existing ones
      const updatedIntervals = mergeIntervals([
        ...(existingProgress?.watchedIntervals || []),
        watchedInterval
      ]);

      // Calculate new progress percentage
      const progressPercentage = calculateProgress(updatedIntervals, videoDuration);

      // Update in database
      const updatedProgress = await updateProgress(userId, videoId, {
        watchedIntervals: updatedIntervals,
        progressPercentage,
        currentTime,
        lastWatched: new Date()
      });

      res.status(200).json(updatedProgress);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update progress' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}