import React from 'react';
import VideoPlayer from './Components/VideoPlayer';


const videos = [
  {
    id: 'video1',
    title: 'Sample Video 1',
    src: '/sample-10s.mp4',
  },
  {
    id: 'video2',
    title: 'Sample Video 2',
    src: '/sample-20s.mp4',
  },
  {
    id: 'video3',
    title: 'Sample Video 3',
    src: '/sample-30s.mp4',
  },
];

function App() {
  // For demo, use static userId
  const userId = 'user123';

  return (
    <div style={{ maxWidth: 700, margin: 'auto', marginTop: 40 }}>
      <h2>Lecture Video Progress Tracker</h2>
      {videos.map(video => (
        <div key={video.id} style={{ marginBottom: 40 }}>
          <h3>{video.title}</h3>
          <VideoPlayer
            userId={userId}
            videoId={video.id}
            videoSrc={video.src}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
