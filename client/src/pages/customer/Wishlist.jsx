import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-12 max-w-lg mx-auto">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-[var(--color-main-text)] mb-2">Sign in to view your wishlist</h2>
          <p className="text-[var(--color-secondary-text)] mb-8">Save your favorite products and access them anytime.</p>
          <Link
            to="/login"
            className="inline-flex items-center bg-[var(--color-primary)] text-white px-6 py-3 rounded-md font-medium hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-12 max-w-lg mx-auto">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-[var(--color-main-text)] mb-2">Your wishlist is empty</h2>
          <p className="text-[var(--color-secondary-text)] mb-8">Browse products and save your favorites here.</p>
          <Link
            to="/products"
            className="inline-flex items-center bg-[var(--color-primary)] text-white px-6 py-3 rounded-md font-medium hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[var(--color-main-text)] mb-8">My Wishlist ({wishlistItems.length})</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden flex flex-col">
            <Link to={`/products/${product._id}`} className="relative h-48 overflow-hidden">
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <div className="p-4 flex flex-col flex-grow">
              <Link to={`/products/${product._id}`}>
                <h3 className="font-bold text-[var(--color-main-text)] hover:text-[var(--color-primary)] transition-colors">{product.name}</h3>
              </Link>
              <p className="text-lg font-bold text-[var(--color-main-text)] mt-2">${product.price?.toFixed(2)}</p>
              
              <div className="flex gap-2 mt-auto pt-4">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="flex-1 flex items-center justify-center bg-[var(--color-primary)] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" /> Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="p-2 border border-gray-300 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
