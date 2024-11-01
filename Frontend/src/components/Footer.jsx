import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlusCircle, faStore, faFilm } from '@fortawesome/free-solid-svg-icons';
import AddMediaModal from './Models/AddMediaModal';

function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t-4 border-gray-300 shadow-md z-50">
      <div className="flex justify-around items-center h-16">
        <Link to="" className="flex flex-col items-center text-gray-700 hover:text-black transform hover:scale-105 transition-all duration-300">
          <div className="p-2 bg-gray-100 rounded-full shadow-lg border border-gray-300">
            <FontAwesomeIcon icon={faHome} size="lg" />
          </div>
          <span className="font-semibold text-sm mt-1">Home</span>
        </Link>
        
        <Link to="Reels" className="flex flex-col items-center text-gray-700 hover:text-black transform hover:scale-105 transition-all duration-300">
          <div className="p-2 bg-gray-100 rounded-full shadow-lg border border-gray-300">
            <FontAwesomeIcon icon={faFilm} size="lg" />
          </div>
          <span className="font-semibold text-sm mt-1">Reels</span>
        </Link>
        
        {/* Add Button to open modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center text-gray-700 hover:text-black transform hover:scale-105 transition-all duration-300 focus:outline-none"
        >
          <div className="p-2 bg-gray-100 rounded-full shadow-lg border border-gray-300">
            <FontAwesomeIcon icon={faPlusCircle} size="lg" />
          </div>
          <span className="font-semibold text-sm mt-1">Add</span>
        </button>
        
        <Link to="Store" className="flex flex-col items-center text-gray-700 hover:text-black transform hover:scale-105 transition-all duration-300">
          <div className="p-2 bg-gray-100 rounded-full shadow-lg border border-gray-300">
            <FontAwesomeIcon icon={faStore} size="lg" />
          </div>
          <span className="font-semibold text-sm mt-1">Store</span>
        </Link>
      </div>
      
      {isModalOpen && <AddMediaModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default Footer;
