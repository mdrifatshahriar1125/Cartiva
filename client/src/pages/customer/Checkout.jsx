import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { CreditCard, Truck, Check } from 'lucide-react';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingCost = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shippingCost;

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.email || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      setError('Please fill in all shipping fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingCost,
        totalPrice: total,
      };

      const { data } = await axios.post('/api/orders', orderData, config);
      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-12 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-[var(--color-main-text)] mb-2">Your cart is empty</h2>
          <p className="text-[var(--color-secondary-text)] mb-8">Add some products before checking out.</p>
          <Link to="/products" className="inline-flex items-center bg-[var(--color-primary)] text-white px-6 py-3 rounded-md font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[var(--color-main-text)] mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Left: Shipping + Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Shipping */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
              <div className="flex items-center mb-6">
                <Truck className="h-5 w-5 text-[var(--color-primary)] mr-2" />
                <h2 className="text-lg font-bold text-gray-900">Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" name="fullName" id="fullName" required value={shippingAddress.fullName} onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="tel" name="phone" id="phone" required value={shippingAddress.phone} onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" name="email" id="email" required value={shippingAddress.email} onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input type="text" name="address" id="address" required value={shippingAddress.address} onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" name="city" id="city" required value={shippingAddress.city} onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input type="text" name="postalCode" id="postalCode" required value={shippingAddress.postalCode} onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
              <div className="flex items-center mb-6">
                <CreditCard className="h-5 w-5 text-[var(--color-primary)] mr-2" />
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'Cash on Delivery' ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'Mock Card Payment' ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="paymentMethod" value="Mock Card Payment" checked={paymentMethod === 'Mock Card Payment'} onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Mock Card Payment</p>
                    <p className="text-xs text-gray-500">Demo payment — no real card needed</p>
                  </div>
                </label>

                {paymentMethod === 'Mock Card Payment' && (
                  <div className="ml-8 mt-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-700 text-sm">
                      <Check className="h-4 w-4 mr-2" />
                      <span className="font-medium">Demo Mode — Payment will be automatically marked as paid.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="mt-8 lg:mt-0 lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="divide-y divide-gray-200 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex py-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-3 flex flex-1 flex-col justify-center">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 self-center">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shippingCost === 0 ? <span className="text-green-600">Free</span> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full bg-[var(--color-primary)] text-white py-3 px-4 rounded-md font-medium hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
