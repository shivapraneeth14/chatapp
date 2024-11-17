import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'

const OrderForm = ({ item, onClose }) => {
    const{username} = useParams()
    const [orderDetails, setOrderDetails] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        amount: item.price,
    });
    const [loading, setLoading] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails({ ...orderDetails, [name]: value });
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const { customerName, customerEmail, customerPhone, amount } = orderDetails;
    
            console.log("Order Details:", orderDetails);
    
            const response = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/createOrder`, {
                customerName,
                customerEmail,
                customerPhone,
                amount,
                productId: item._id,
                username,
            });
    
            const { payment_session_id } = response.data;
            console.log("Payment Session ID:", payment_session_id);
            const cashfree = window.Cashfree({ mode: 'sandbox' });
    
    
            const checkoutOptions = {
                paymentSessionId: payment_session_id,
                redirectTarget: '_self',
                appearance: {
                    width: "1024px",
                    height: "700px",
                },
            };
    
            console.log('Initiating checkout:', checkoutOptions);
    
            await cashfree.checkout(checkoutOptions).then((result) => {
                if (result.error) {
                    console.error('Payment Error:', result.error);
                } else if (result.paymentDetails) {
                    console.log('Payment Successful:', result.paymentDetails.paymentMessage);
                }
            });
        } catch (error) {
            console.error('Error during order creation or checkout:', error);
            alert('Failed to create order or process payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <span
                    className="absolute top-3 right-3 text-gray-600 cursor-pointer"
                    onClick={onClose}
                >
                    &times;
                </span>
                <h2 className="text-2xl font-semibold text-center mb-4">
                    Order Form for {item.name}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="text"
                        name="customerName"
                        placeholder="Customer Name"
                        value={orderDetails.customerName}
                        onChange={handleChange}
                        required
                        className="mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        name="customerEmail"
                        placeholder="Customer Email"
                        value={orderDetails.customerEmail}
                        onChange={handleChange}
                        required
                        className="mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="customerPhone"
                        placeholder="Customer Phone"
                        value={orderDetails.customerPhone}
                        onChange={handleChange}
                        required
                        className="mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={orderDetails.amount}
                        readOnly
                        className="mb-4 p-2 border border-gray-300 rounded bg-gray-200"
                    />
                    {loading && <p>Loading, please wait...</p>}
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-800 font-semibold py-2 rounded hover:bg-gray-400 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200"
                            disabled={loading}
                        >
                            Proceed to Pay
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderForm;
