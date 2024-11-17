import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Home.css';
import StoryModal from './StoryModal'; 

function Home() {
  const { username } = useParams();
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_FRONTEND_URL}/api/allposts`);
        console.log(response);
        setPosts(response.data.posts);
      } catch (error) {
        console.log(error);
      }
    };
    getPosts();
  }, []);

  useEffect(() => {
    const getEmail = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/getuseremail`, { username });
        setEmail(response.data.email);
      } catch (error) {
        console.error(error);
      }
    };
    getEmail();
  }, [username]);

  const sendFeedback = async () => {
    const msg = {
      from: email,
      to: "shivakandala43@gmail.com",
      subject: "Feedback",
      text: feedback,
    };
    try {
      const response = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/sendfeedback`, msg);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const stories = [
    { id: 1, name: 'Alice', image: 'https://placekitten.com/100/100' },
    { id: 2, name: 'Bob', image: 'https://placekitten.com/101/101' },
    { id: 3, name: 'Charlie', image: 'https://placekitten.com/102/102' },
  ];

  const openStoryModal = (story) => {
    setSelectedStory(story);
  };

  const closeStoryModal = () => {
    setSelectedStory(null);
  };

  return (
    <div className="min-h-screen bg-white p-6">
     
      <div className="flex space-x-6 overflow-x-auto pb-6 border-b-2 border-gray-300">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center cursor-pointer" onClick={() => openStoryModal(story)}>
            <img 
              src={story.image} 
              alt={story.name} 
              className="w-20 h-20 rounded-full border border-gray-300"
            />
            <p className="text-gray-700 text-sm mt-2">{story.name}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8 mt-8">
        {posts.filter(post => post.image).map((post) => (
          <div 
            key={post._id} 
            className="bg-white border border-gray-300 rounded-lg shadow-sm p-6 relative"
          >
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <img 
                src={post.image} 
                alt={post.userid} 
                className="w-10 h-10 rounded-full border border-gray-300"
              />
              <p className="text-gray-800 font-semibold">{post.user}</p>
            </div>

            <p className="text-gray-600 mb-4 mt-12">{post.description}</p>
            <img 
              src={post.image} 
              alt="Post" 
              className="w-full h-64 object-cover rounded-lg"
            />

            <div className="flex space-x-6 mt-4">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-black">
                <FontAwesomeIcon icon={faHeart} size="lg" />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-700 hover:text-black">
                <FontAwesomeIcon icon={faComment} size="lg" />
                <span>Comment</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-700 hover:text-black">
                <FontAwesomeIcon icon={faShare} size="lg" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <StoryModal story={selectedStory} onClose={closeStoryModal} />

      <div className="mt-12 flex w-full">
        <input
          placeholder="Your feedback..."
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-4 rounded-l-lg border border-gray-300 text-black outline-none"
        />
        <button
          onClick={sendFeedback}
          className="bg-blue-600 text-white font-semibold px-6 py-4 rounded-r-lg hover:bg-blue-500 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Home;
