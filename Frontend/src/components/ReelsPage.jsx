import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';

function ReelsPage() {
  // Sample video data
  const videos = [
    "https://www.example.com/video1.mp4",
    "https://www.example.com/video2.mp4",
    "https://www.example.com/video3.mp4",
    // Add more video URLs as needed
  ];

  return (
    <div className="bg-black text-white min-h-screen overflow-y-scroll">
      {videos.map((video, index) => (
        <div key={index} className="relative flex items-center justify-center min-h-screen w-full">
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Icons for Like, Comment, Share */}
          <div className="absolute bottom-16 right-4 flex flex-col items-center space-y-4 text-white">
            <button className="flex flex-col items-center">
              <FontAwesomeIcon icon={faHeart} size="lg" />
              <span className="text-sm mt-1">Like</span>
            </button>
            <button className="flex flex-col items-center">
              <FontAwesomeIcon icon={faComment} size="lg" />
              <span className="text-sm mt-1">Comment</span>
            </button>
            <button className="flex flex-col items-center">
              <FontAwesomeIcon icon={faShare} size="lg" />
              <span className="text-sm mt-1">Share</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReelsPage;

