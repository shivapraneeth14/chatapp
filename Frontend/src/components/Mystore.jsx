
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'

function MyStore() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { username } = useParams();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
 

  useEffect(()=>{
    const getmystore = async()=>{
      try {
        console.log("getting my store items")
        const response  = await axios.post("http://localhost:8000/api/mystoreitems",{username:username})
        console.log(response.data.products)
        setItems(response.data.products)
      } catch (error) {
        console.log(error)
      }
    }
    getmystore();
  },[username]);
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    category: ''
  });
 
  const [items, setItems] = useState([
  ]);

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewItem({
      name: '',
      description: '',
      price: '',
      stock: '',
      image: '',
      category: ''
    });
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedItem(null);
  };

 

  
  const handleAddItem = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", newItem.name);
    formData.append("description", newItem.description);
    formData.append("price", newItem.price);
    formData.append("stock", newItem.stock);
    formData.append("category", newItem.category);
    
    if (newItem.image) {
        formData.append("image", newItem.image); 
        console.log("image file",newItem.image)
    }

    try {
        const response = await axios.post("http://localhost:8000/api/additem", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log("response data",response.data);
        closeAddModal();
    } catch (error) {
        console.error("Error adding item:", error.response ? error.response.data : error.message);
    }

};
const deleteitem= async(id)=>{
  try {
    const response = await axios.post("http://localhost:8000/api/Deleteitem",{username:username, productid:id})
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Add Item
        </button>
      </div>

      <div className="text-center text-2xl font-bold mb-6">My Items for Sale</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-lg rounded-lg p-4 cursor-pointer"
            onClick={() => openDetailModal(item)}
          >
            <img
               src={item.imageUrl
                || 'https://via.placeholder.com/150'}
              alt={item.name}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-4">{item.price}</p>
            <div className=" flex justify-end">
              <button
              onClick={() => deleteitem(item._id)}
               className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">Delete</button>
            </div>
          </div>
        ))} 
      </div>

      {showAddModal && (
        <div className="fixed w-auto h-auto inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
            <form onSubmit={handleAddItem}>
             
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={(e) => {
                    setNewItem(prevItem => ({
                      ...prevItem,
                      name: e.target.value
                    }));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newItem.description}
                  onChange={(e) => {
                    setNewItem(prevItem => ({
                      ...prevItem,
                      description: e.target.value
                    }));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter item description"
                  required
                  maxLength={1000}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={newItem.price}
                  onChange={(e) => {
                    setNewItem(prevItem => ({
                      ...prevItem,
                      price: e.target.value
                    }));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter price"
                  required
                  min={0}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={newItem.stock}
                  onChange={(e) => {
                    setNewItem(prevItem => ({
                      ...prevItem,
                      stock: e.target.value
                    }));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter stock"
                  required
                  min={0}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={newItem.category}
                  onChange={(e) => {
                    setNewItem(prevItem => ({
                      ...prevItem,
                      category: e.target.value
                    }));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter category"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Upload Image</label>
                <input
                  type="file"
                  onChange={(e) => {
                    setNewItem(prevItem => ({
                      ...prevItem,
                      image: e.target.files[0]
                    }));
                  }}
                  className="w-full"
                  accept="image/*"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-gray-600 transition"
                  onClick={closeAddModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl flex">
            <div className="w-1/2">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
            <div className="w-1/2 p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
              <p className="text-lg text-gray-700 mb-4">{selectedItem.description}</p>
              <p className="text-xl font-semibold text-gray-800">{selectedItem.price}</p>
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  onClick={closeDetailModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyStore;
