let progressData = new Map();

export async function getProgress(userId, videoId) {
  const key = `${userId}-${videoId}`;
  return progressData.get(key) || {
    userId,
    videoId,
    watchedIntervals: [],
    progressPercentage: 0,
    currentTime: 0,
    lastWatched: null
  };
}

export async function updateProgress(userId, videoId, data) {
  const key = `${userId}-${videoId}`;
  const progress = {
    userId,
    videoId,
    ...data
  };
  progressData.set(key, progress);
  return progress;
}
