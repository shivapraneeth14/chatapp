import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function ReelsPage() {
  const [posts, setPosts] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/allposts");
        
        const videoPosts = response.data.posts.filter(post => post.video);
        
        setPosts(videoPosts);
      } catch (error) {
        console.error(error);
      }
    };
    getPosts();
  }, []);

  const handleScroll = (e) => {
    e.preventDefault();
    
    if (e.deltaY > 0) {
      containerRef.current.scrollBy({
        top: containerRef.current.clientHeight,
        behavior: 'smooth',
      });
    } else {
      containerRef.current.scrollBy({
        top: -containerRef.current.clientHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      onWheel={handleScroll}
      className="flex justify-center w-screen h-[calc(100vh-56px-90px)] overflow-hidden"
      style={{
        scrollbarWidth: 'none',   
        msOverflowStyle: 'none',   
      }}
    >
      <style>{`
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="w-96 h-full overflow-y-auto scroll-container">
        {posts.map((post, index) => (
          <video
            key={index}
            className="w-[300px] h-[calc(100vh-56px-90px)] object-cover"
            src={post.video}
            muted
            playsInline
            loop
            autoPlay
          />
        ))}
      </div>
    </div>
  );
}

export default ReelsPage;

