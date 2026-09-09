import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQty, clearCart } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingCost = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-12 max-w-lg mx-auto">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-[var(--color-main-text)] mb-2">Your cart is empty</h2>
          <p className="text-[var(--color-secondary-text)] mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center bg-[var(--color-primary)] text-white px-6 py-3 rounded-md font-medium hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-main-text)]">Shopping Cart</h1>
        <span className="text-[var(--color-secondary-text)]">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Cart Items */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.product} className="flex py-6 px-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <Link to={`/products/${item.product}`} className="hover:text-[var(--color-primary)] transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="ml-4 font-bold">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-secondary-text)]">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => updateCartQty(item.product, Math.max(1, item.qty - 1))}
                        disabled={item.qty <= 1}
                        className="p-2 text-gray-600 hover:text-[var(--color-primary)] disabled:opacity-50 focus:outline-none"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 text-gray-900 font-medium">{item.qty}</span>
                      <button
                        onClick={() => updateCartQty(item.product, Math.min(item.countInStock, item.qty + 1))}
                        disabled={item.qty >= item.countInStock}
                        className="p-2 text-gray-600 hover:text-[var(--color-primary)] disabled:opacity-50 focus:outline-none"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="text-red-500 hover:text-red-700 flex items-center transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <Link to="/products" className="text-[var(--color-primary)] hover:underline inline-flex items-center text-sm font-medium">
              <ArrowLeft className="h-4 w-4 mr-1" /> Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:mt-0 lg:col-span-5">
          <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-green-600">Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>
              )}
              <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/checkout"
                className="w-full flex justify-center items-center bg-[var(--color-primary)] text-white px-6 py-3 rounded-md font-medium hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
