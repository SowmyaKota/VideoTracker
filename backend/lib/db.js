// Simple in-memory DB for demo (replace with real DB in production)
const db = {};

export function getProgress(userId, videoId) {
  return db[`${userId}_${videoId}`] || {
    intervals: [],
    lastPosition: 0,
    progress: 0,
  };
}

export function saveProgress(userId, videoId, intervals, lastPosition, progress) {
  db[`${userId}_${videoId}`] = { intervals, lastPosition, progress };
}
