import React from 'react';
import './App.css';
import VideoPlayer from './Components/VideoPlayer';

function App() {
  // In a real app, these would come from routing/props
  const userId = 'user123';
  const videoId = 'lecture001';
  const videoSrc = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lecture Video Player</h1>
        <p>Advanced Progress Tracking System</p>
      </header>
      
      <main className="App-main">
        <VideoPlayer 
          videoId={videoId}
          userId={userId}
          videoSrc={videoSrc}
        />
      </main>
    </div>
  );
}

export default App;