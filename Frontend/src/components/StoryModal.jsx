import React from 'react';

function StoryModal({ story, onClose }) {
  if (!story) return null; // Return null if no story is selected

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <button 
        onClick={onClose} 
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
        }}
      >
        &times;
      </button>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <img 
          src={story.image} 
          alt={story.name} 
          style={{ width: '80%', height: 'auto', borderRadius: '10px' }} 
        />
        <p style={{ marginTop: '20px', fontSize: '20px' }}>{story.name}</p>
      </div>
    </div>
  );
}

export default StoryModal;

