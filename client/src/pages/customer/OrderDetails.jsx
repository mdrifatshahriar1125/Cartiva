import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Package, Truck, CheckCircle, CreditCard, MapPin } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block mb-4">{error || 'Order not found'}</div>
        <br />
        <Link to="/orders" className="text-[var(--color-primary)] hover:underline inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
        </Link>
      </div>
    );
  }

  // Calculate tracking progress
  const statuses = ['Processing', 'Shipped', 'Delivered'];
  const currentStatusIndex = statuses.indexOf(order.status);
  const progressPercentage = currentStatusIndex === -1 ? 0 : (currentStatusIndex / (statuses.length - 1)) * 100;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Link to="/orders" className="text-gray-400 hover:text-gray-600 mr-3 transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            Order Details
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-500">Order # <span className="font-mono font-medium text-gray-900">{order._id}</span></p>
            <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Tracking Section */}
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-8">Order Status</h2>
          
          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
              <div style={{ width: `${progressPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[var(--color-primary)] transition-all duration-500"></div>
            </div>
            
            <div className="flex justify-between w-full">
              <div className="flex flex-col items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-2 ${currentStatusIndex >= 0 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-400'}`}>
                  <Package className="h-4 w-4" />
                </div>
                <span className={`text-xs font-medium ${currentStatusIndex >= 0 ? 'text-gray-900' : 'text-gray-400'}`}>Processing</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-2 ${currentStatusIndex >= 1 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-400'}`}>
                  <Truck className="h-4 w-4" />
                </div>
                <span className={`text-xs font-medium ${currentStatusIndex >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Shipped</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-2 ${currentStatusIndex >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className={`text-xs font-medium ${currentStatusIndex >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Delivered</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Items in your order</h2>
              <div className="divide-y divide-gray-100">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="py-4 flex">
                    <div className="h-20 w-20 flex-shrink-0 rounded-md border border-gray-200 overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            <Link to={`/products/${item.product}`} className="hover:text-[var(--color-primary)]">{item.name}</Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">Qty: {item.qty}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Info */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost?.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>${order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" /> Shipping Address
              </h2>
              <address className="not-italic text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p className="pt-2 flex items-center text-gray-500">Phone: {order.shippingAddress.phone}</p>
              </address>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-gray-400" /> Payment Information
              </h2>
              <div className="text-sm text-gray-600">
                <p><span className="font-medium text-gray-900">Method:</span> {order.paymentMethod}</p>
                <p className="mt-1">
                  <span className="font-medium text-gray-900">Status:</span> 
                  <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
