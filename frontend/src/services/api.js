const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const getVideoProgress = async (userId, videoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/${userId}?videoId=${videoId}`);
    if (!response.ok) throw new Error('Failed to fetch progress');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const updateVideoProgress = async (userId, videoId, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        videoId,
        ...data
      }),
    });
    
    if (!response.ok) throw new Error('Failed to update progress');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};