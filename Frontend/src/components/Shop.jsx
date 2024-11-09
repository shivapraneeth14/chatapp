// src/components/Shop.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Mystore from './Mystore';
import OrderForm from './OrderForm'; // Import the OrderForm component

function Shop() {
  const [store, setStore] = useState(false);
  const [userstore, setUserstore] = useState(false);
  const { username } = useParams();
  const location = useLocation();
  const isUserStore = location.state?.isUserStore || false;
  const Storebelongto = location.state?.Storebelongto || null;
  const [items, setstorebelongtoitems] = useState([]);
  const [allitems, setallitems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false); 

  useEffect(() => {
    const getAllItems = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/storeitem');
        console.log(response);
        setallitems(response.data.products);
      } catch (error) {
        console.error(error);
      }
    };
    getAllItems();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/Profile', {
          params: { username },
        });
        console.log('username', username);
        setStore(response.data.user.store);
        console.log('isUserStore', isUserStore);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, [username, isUserStore]);

  useEffect(() => {
    const getStoreItems = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/useritem', {
          userid: Storebelongto,
        });
        console.log(response);
        setstorebelongtoitems(response.data.products);
      } catch (error) {
        console.error(error);
      }
    };

    if (Storebelongto) {
      getStoreItems();
    }
  }, [Storebelongto]);

  const openOrderForm = (item) => {
    setSelectedItem(item);
    setShowOrderForm(true);
  };

  const closeOrderForm = () => {
    setShowOrderForm(false);
    setSelectedItem(null);
  };

  return (
    <div className="container mx-auto p-6">
      {showOrderForm && selectedItem && (
        <OrderForm item={selectedItem} onClose={closeOrderForm} />
      )}

      {Storebelongto ? (
        <div className="flex justify-evenly">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-lg rounded-lg p-4 cursor-pointer"
            >
              <img
                src={item.imageUrl || 'https://via.placeholder.com/150'}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">{item.price}</p>
              <button
                onClick={() => openOrderForm(item)}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                BUY
              </button>
            </div>
          ))}
        </div>
      ) : isUserStore || userstore ? (
        <Mystore />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            {store ? (
              <button
                onClick={() => setUserstore((prev) => !prev)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
              >
                My store
              </button>
            ) : (
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
                Create Your Own Store
              </button>
            )}
          </div>

          <div className="text-4xl font-extrabold text-center text-gray-800 mb-10">
            Explore Our Products
          </div>
          <div className="flex justify-evenly">
            {allitems.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-lg rounded-lg p-4 cursor-pointer"
              >
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.price}</p>
                <button
                  onClick={() => openOrderForm(item)}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  BUY
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Shop;
