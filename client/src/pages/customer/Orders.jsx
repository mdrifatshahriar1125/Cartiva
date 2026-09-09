import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowRight } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        const { data } = await axios.get('/api/orders/my', config);
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Shipped':
        return <Truck className="h-5 w-5 text-indigo-500" />;
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[var(--color-main-text)] mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-12 text-center max-w-lg mx-auto">
          <Package className="mx-auto h-16 w-16 text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-[var(--color-main-text)] mb-2">No orders yet</h2>
          <p className="text-[var(--color-secondary-text)] mb-8">When you place an order, it will appear here.</p>
          <Link
            to="/products"
            className="inline-flex items-center bg-[var(--color-primary)] text-white px-6 py-3 rounded-md font-medium hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row sm:gap-8 gap-4 mb-4 sm:mb-0">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Order Number</p>
                    <p className="text-sm font-semibold text-gray-900 font-mono">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date Placed</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="text-sm font-semibold text-gray-900">${order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{order.status}</span>
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="snap-start shrink-0 w-24 flex flex-col items-center">
                      <div className="h-24 w-24 rounded-md border border-gray-200 overflow-hidden mb-2 relative">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        {item.qty > 1 && (
                          <span className="absolute bottom-1 right-1 bg-gray-900 bg-opacity-75 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                            x{item.qty}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <Link 
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
                  >
                    View Order Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
