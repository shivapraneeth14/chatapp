import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCamera, faVideo } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function AddMediaModal({ onClose, userid }) {
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileUpload = (type) => {
    setMediaType(type);
    setFile(null);
    setPreview(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("selected file",selectedFile)
    setFile(selectedFile);

    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setPreview(fileURL);
      console.log("fileurl",fileURL)
    }
  };

  const handleSubmit = async () => {
    if (!file || !description) {
      alert('Please add both a description and a media file.');
      return;
    }

    const formData = new FormData();
    formData.append('userid', userid);
    formData.append('description', description);
    formData.append('media', file); 

    try {
      console.log("fileuploaduserid",userid)
      const response = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/addmedia`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      console.log(`Submitting: ${description}, ${mediaType}`);
      setDescription('');
      setFile(null);
      setPreview(null);
      setMediaType(null);
      onClose();
    } catch (error) {
      console.error("Error uploading media:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 w-11/12 max-w-md shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Add New Media</h2>

        <div className="flex justify-around mb-4">
          <button
            onClick={() => handleFileUpload('image')}
            className={`flex flex-col items-center text-gray-700 hover:text-black ${mediaType === 'image' ? 'text-blue-500' : ''}`}
          >
            <div className="p-4 bg-gray-100 rounded-full shadow-lg border border-gray-300">
              <FontAwesomeIcon icon={faCamera} size="2x" />
            </div>
            <span className="mt-2 font-semibold text-sm">Image</span>
          </button>

          <button
            onClick={() => handleFileUpload('video')}
            className={`flex flex-col items-center text-gray-700 hover:text-black ${mediaType === 'video' ? 'text-blue-500' : ''}`}
          >
            <div className="p-4 bg-gray-100 rounded-full shadow-lg border border-gray-300">
              <FontAwesomeIcon icon={faVideo} size="2x" />
            </div>
            <span className="mt-2 font-semibold text-sm">Video</span>
          </button>
        </div>

        {mediaType && (
          <div className="mb-4">
            <input
              type="file"
              accept={mediaType === 'image' ? 'image/*' : 'video/*'}
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
        )}

        {preview && (
          <div className="mb-4">
            {mediaType === 'image' ? (
              <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
            ) : (
              <video src={preview} controls className="w-full h-48 object-cover rounded-lg" />
            )}
          </div>
        )}

        <input
          type="text"
          placeholder="Enter description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-4 mt-4 border border-gray-300 rounded-lg focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-500 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default AddMediaModal;
