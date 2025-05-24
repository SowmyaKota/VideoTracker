import React from 'react';

const ProgressBar = ({ progress, currentTime, duration }) => {
  const playbackProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span>Unique Content Progress</span>
        <span>{progress.toFixed(1)}%</span>
      </div>
      
      <div className="progress-bar-wrapper">
        {/* Unique content progress bar */}
        <div className="progress-bar unique-progress">
          <div 
            className="progress-fill unique-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Playback position indicator */}
        <div className="progress-bar playback-progress">
          <div 
            className="progress-fill playback-fill"
            style={{ width: `${playbackProgress}%` }}
          />
        </div>
      </div>
      
      <div className="progress-legend">
        <div className="legend-item">
          <div className="legend-color unique-color"></div>
          <span>Unique Content Watched</span>
        </div>
        <div className="legend-item">
          <div className="legend-color playback-color"></div>
          <span>Current Playback Position</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;