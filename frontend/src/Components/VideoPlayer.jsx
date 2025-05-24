import React, { useState, useRef, useEffect } from 'react';
import { updateVideoProgress, getVideoProgress } from '../services/api';
import { debounce } from '../utils/intervalUtils';
import ProgressBar from './ProgressBar';

const VideoPlayer = ({ videoId, userId, videoSrc }) => {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]=useState(null)
  
  // Track watching intervals
  const watchingStartTime = useRef(null);
  const lastUpdateTime = useRef(0);

  // Load saved progress on component mount
  useEffect(() => {
    loadProgress();
  }, [videoId, userId]);

  const loadProgress = async () => {
    try {
      const savedProgress = await getVideoProgress(userId, videoId);
      if (savedProgress) {
        setProgress(savedProgress.progressPercentage || 0);
        setCurrentTime(savedProgress.currentTime || 0);
        
        // Resume from saved position
        if (videoRef.current && savedProgress.currentTime) {
          videoRef.current.currentTime = savedProgress.currentTime;
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load progress:', error);
      setError('Failed to load progress. Using default values.')
      setIsLoading(false);
    }
  };

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setError(null)
    }
  };
  // Handle play event
  const handlePlay = () => {
    watchingStartTime.current = videoRef.current?.currentTime || 0;
  };

  // Handle pause event
  const handlePause = () => {
    if (watchingStartTime.current !== null && videoRef.current) {
      const endTime = videoRef.current.currentTime;
      saveWatchedInterval(watchingStartTime.current, endTime);
      watchingStartTime.current = null;
    }
  };

  // Handle seeking
  const handleSeeked = () => {
    if (watchingStartTime.current !== null && videoRef.current) {
      const endTime = lastUpdateTime.current;
      if (endTime > watchingStartTime.current) {
        saveWatchedInterval(watchingStartTime.current, endTime);
      }
    }
    watchingStartTime.current = videoRef.current?.currentTime || 0;
  };
  // Handle time update
  const handleTimeUpdate = debounce(() => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);
      lastUpdateTime.current = current;
      
      // Save progress periodically while playing
      if (watchingStartTime.current !== null && current - watchingStartTime.current >= 5) {
        saveWatchedInterval(watchingStartTime.current, current);
        watchingStartTime.current = current;
      }
    }
  }, 1000);

  // Save watched interval to backend
  const saveWatchedInterval = async (startTime, endTime) => {
    if (startTime >= endTime || endTime - startTime < 1) return;
    
    try {
      const watchedInterval = {
        start: Math.floor(startTime),
        end: Math.floor(endTime)
      };
      const updatedProgress = await updateVideoProgress(userId, videoId, {
        watchedInterval,
        videoDuration: duration,
        currentTime: endTime
      });

      setProgress(updatedProgress.progressPercentage || 0);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  // Handle video end
  const handleEnded = () => {
    if (watchingStartTime.current !== null && videoRef.current) {
      saveWatchedInterval(watchingStartTime.current, videoRef.current.duration);
      watchingStartTime.current = null;
    }
  };

// Handle video load error
const handleError=(e)=>{
  console.error('video load error:', e);
  setError('failed to load video. Please try another video.');
};

  if (isLoading) {
    return (
      <div className='video-player-container'>
    <div className="loading">Loading video progress...</div>;
    </div>
    )
  }
   return (
    <div className="video-player-container">
      <div className="video-header">
        <h2>{videoTitle}</h2>
        <div className='video-wrapper'>
          {error && (
            <div className='error-message'>
              {error}
              </div>
          )}
        <video
          ref={videoRef}
          src={videoSrc}
          controls
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeked={handleSeeked}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={handleError}
          style={{ width: '100%', maxWidth: '800px' }}
          crossOrigin='anonymous'
        />
      </div>
      
      <ProgressBar 
        progress={progress}
        currentTime={currentTime}
        duration={duration}
      />
      <div className="video-info">
        <p>Progress: {progress.toFixed(1)}% of unique content watched</p>
        <p>Current Time: {formatTime(currentTime)} / {formatTime(duration)}</p>
      </div>
    </div>
    </div>
  );
};

// Helper function to format time
const formatTime = (time) => {
  if (!time) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default VideoPlayer;