export function mergeIntervals(intervals) {
  if (!intervals || intervals.length === 0) return [];
  
  // Sort intervals by start time
  const sorted = intervals
    .filter(interval => interval && typeof interval.start === 'number' && typeof interval.end === 'number')
    .sort((a, b) => a.start - b.start);
  
  const merged = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];
    
    // If current interval overlaps with the last one, merge them
    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }
  
  return merged;
}
export function calculateProgress(intervals, videoDuration) {
  if (!intervals || intervals.length === 0 || !videoDuration) return 0;
  
  const totalWatchedTime = intervals.reduce((total, interval) => {
    return total + (interval.end - interval.start);
  }, 0);
  
  return Math.min(100, (totalWatchedTime / videoDuration) * 100);
}

export function isNewContent(newInterval, existingIntervals) {
  if (!existingIntervals || existingIntervals.length === 0) return true;
  
  for (const existing of existingIntervals) {
    // Check if new interval is completely within an existing interval
    if (newInterval.start >= existing.start && newInterval.end <= existing.end) {
      return false;
    }
  }
  return true;
}