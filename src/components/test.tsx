import React from 'react';

const VideoTest: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100vh', background: 'black' }}>
            <h1 style={{ color: 'white' }}>Video Test</h1>

            <video
                src="/videos/3star-singe.mp4"
                controls
                width="100%"
                height="auto"
                style={{ maxHeight: '80vh' }}
            />

            <div style={{ color: 'white', marginTop: '20px' }}>
                If you can see and play this video, your video file is accessible.
            </div>
        </div>
    );
};

export default VideoTest;