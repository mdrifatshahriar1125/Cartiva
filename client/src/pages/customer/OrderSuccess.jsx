import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-10">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-[var(--color-main-text)] mb-2">Order Placed Successfully!</h1>
        <p className="text-[var(--color-secondary-text)] mb-8">Thank you for your order. We'll get it to you soon.</p>

        {order && (
          <div className="bg-gray-50 rounded-lg p-6 text-left mb-8 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Order ID</span>
              <span className="text-sm font-mono font-medium text-gray-900">{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Amount</span>
              <span className="text-sm font-bold text-gray-900">${order.totalPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Payment Method</span>
              <span className="text-sm text-gray-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span className="text-sm font-medium text-yellow-600">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Estimated Delivery</span>
              <span className="text-sm text-gray-900">5–7 Business Days</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={`/orders/${id}`}
            className="inline-flex items-center justify-center bg-[var(--color-primary)] text-white px-6 py-3 rounded-md font-medium hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
          >
            <Package className="h-5 w-5 mr-2" /> View Order
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            <ShoppingBag className="h-5 w-5 mr-2" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
