import React, { useRef, useState, useEffect } from 'react';
import { mergeIntervals, getUniqueWatchedSeconds } from '../utils/intervalUtils';

const API_URL = '/api/progress'; // Adjust if needed

export default function VideoPlayer({ userId, videoId, videoSrc }) {
  const videoRef = useRef();
  const [watchedIntervals, setWatchedIntervals] = useState([]);
  const [currentInterval, setCurrentInterval] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [completeViews, setCompleteViews] = useState(0);

 // Load progress on mount
useEffect(() => {
  fetch(`/api/progress?userId=${userId}&videoId=${videoId}`)
    .then(res => res.json())
    .then(data => {
      setWatchedIntervals(data.intervals || []);
      setPlayCount(data.playCount || 0);
      setCompleteViews(data.completeViews || 0);
      if (videoRef.current && data.lastPosition) {
        videoRef.current.currentTime = data.lastPosition;
      }
    });
}, [userId, videoId]);

// Save progress when intervals or counts change
useEffect(() => {
  fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      videoId,
      intervals: watchedIntervals,
      lastPosition: videoRef.current?.currentTime || 0,
      playCount,
      completeViews,
    }),
  });
}, [watchedIntervals, playCount, completeViews, userId, videoId]);


  // Save progress to backend
 const saveProgressToBackend = (intervals, lastPosition, playCount, completeViews) => {
  fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      videoId,
      intervals,
      lastPosition,
      playCount,
      completeViews,
    }),
  });
};


  // Add these handlers inside your VideoPlayer component, above the return statement

const handlePlay = () => {
  if (Math.floor(videoRef.current.currentTime) === 0) {
    setPlayCount(count => {
      const newCount = count + 1;
      saveProgressToBackend(watchedIntervals, videoRef.current.currentTime, newCount, completeViews);
      return newCount;
    });
  }
  // Start a new interval when the video starts playing
  if (!currentInterval) {
    setCurrentInterval([Math.floor(videoRef.current.currentTime), null]);
  }
};

const handleEnded = () => {
  setCompleteViews(count => {
    const newCount = count + 1;
    saveProgressToBackend(watchedIntervals, videoRef.current.currentTime, playCount, newCount);
    return newCount;
  });
  handlePauseOrEnded();
};

const handlePauseOrEnded = () => {
  // End the current interval when the video is paused or ended
  if (currentInterval && currentInterval[1] === null) {
    const end = Math.floor(videoRef.current.currentTime);
    const newIntervals = [...watchedIntervals, [currentInterval[0], end]];
    const merged = mergeIntervals(newIntervals);
    setWatchedIntervals(merged);
    saveProgressToBackend(merged, end, playCount, completeViews);
    setCurrentInterval(null);
  }
};

const handleSeeked = () => {
  // End the current interval at the seek point and start a new one
  if (currentInterval && currentInterval[1] === null) {
    const end = Math.floor(videoRef.current.currentTime);
    const newIntervals = [...watchedIntervals, [currentInterval[0], end]];
    const merged = mergeIntervals(newIntervals);
    setWatchedIntervals(merged);
     saveProgressToBackend(merged, end, playCount, completeViews);
    setCurrentInterval([end, null]);
  }
};


  // Handle video events
  const handlePlayClick = () => {
    videoRef.current.play();
  };

  const handlePauseClick = () => {
    videoRef.current.pause();
  };

  const handleRewindClick = () => {
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10); // Rewind 10 seconds
  };

  const handleSkipClick = () => {
    videoRef.current.currentTime = Math.min(
      duration,
      videoRef.current.currentTime + 10
    ); // Skip forward 10 seconds
  };
  return (
    <div>
      <video
        ref={videoRef}
        width="640"
        controls
        src={videoSrc}
        onPlay={handlePlay}
        onPause={handlePauseOrEnded}
        onEnded={handleEnded}
        onSeeked={handleSeeked}
        onLoadedMetadata={e => setDuration(Math.floor(e.target.duration))}
        style={{display:'block', marginBottom: 10 }}
      />
      <div style={{ marginBottom: 10 }}>
        <button onClick={handlePlayClick}>Play</button>
        <button onClick={handlePauseClick}>Pause</button>
        <button onClick={handleRewindClick}>Rewind 10s</button>
        <button onClick={handleSkipClick}>Skip 10s</button>
      </div>
        <progress value={progress} max="100" style={{ width: '100%' }} />
        <div>{progress}% watched</div>
        <div>Times played from start: {playCount}</div>
<div>Times watched completely: {completeViews}</div>

      </div>
  );
}
