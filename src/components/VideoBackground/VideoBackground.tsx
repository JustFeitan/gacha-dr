import React from 'react';
import './VideoBackground.scss';

interface VideoBackgroundProps {
    videoPath: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoPath }) => {
    return (
        <div className="video-background">
            <video autoPlay loop muted playsInline className="video-element">
                <source src={videoPath} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoBackground;