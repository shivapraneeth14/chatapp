import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCamera, faVideo } from '@fortawesome/free-solid-svg-icons';

function AddMediaModal({ onClose }) {
  const [description, setDescription] = useState('');

  const handleFileUpload = (type) => {
    console.log(`Selected ${type} for upload`);
    // Placeholder for file upload logic
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 w-11/12 max-w-md shadow-lg relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Add New Media</h2>

        {/* File Options */}
        <div className="flex justify-around mb-4">
          <button onClick={() => handleFileUpload('image')} className="flex flex-col items-center text-gray-700 hover:text-black">
            <div className="p-4 bg-gray-100 rounded-full shadow-lg border border-gray-300">
              <FontAwesomeIcon icon={faCamera} size="2x" />
            </div>
            <span className="mt-2 font-semibold text-sm">Image</span>
          </button>

          <button onClick={() => handleFileUpload('video')} className="flex flex-col items-center text-gray-700 hover:text-black">
            <div className="p-4 bg-gray-100 rounded-full shadow-lg border border-gray-300">
              <FontAwesomeIcon icon={faVideo} size="2x" />
            </div>
            <span className="mt-2 font-semibold text-sm">Video</span>
          </button>
        </div>

        {/* Description Input */}
        <input
          type="text"
          placeholder="Enter description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-4 mt-4 border border-gray-300 rounded-lg focus:outline-none"
        />

        {/* Submit Button */}
        <button
          onClick={() => console.log(`Submitting: ${description}`)}
          className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-500 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default AddMediaModal;
