import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, ArrowLeft, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const increaseQty = () => {
    if (product && qty < product.stock) {
      setQty(qty + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
        <Link to="/products" className="text-[var(--color-primary)] hover:underline inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm text-gray-500">
          <ol className="flex items-center space-x-2">
            <li><Link to="/" className="hover:text-[var(--color-primary)]">Home</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link to="/products" className="hover:text-[var(--color-primary)]">Products</Link></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{product.name}</li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-24 shrink-0 py-1">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                    activeImage === index ? 'border-[var(--color-primary)]' : 'border-transparent'
                  } hover:border-[var(--color-primary-light)] transition-colors`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
            {/* Main Image */}
            <div className="aspect-w-1 aspect-h-1 w-full bg-gray-100 rounded-2xl overflow-hidden flex-1 relative">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.originalPrice > product.price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 lg:mt-0">
            <h2 className="text-sm font-semibold text-[var(--color-primary)] tracking-wide uppercase mb-2">
              {product.brand}
            </h2>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-3 text-sm text-[var(--color-primary)] font-medium hover:underline cursor-pointer">
                {product.numReviews} reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end mb-6">
              <p className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
              {product.originalPrice > product.price && (
                <p className="ml-3 text-lg text-gray-500 line-through mb-1">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-8">
              {product.stock > 0 ? (
                <p className="flex items-center text-green-600 font-medium">
                  <Check className="h-5 w-5 mr-2" /> In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Add to Cart Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 border-b border-gray-200 pb-10">
              <div className="flex items-center border border-gray-300 rounded-md bg-white">
                <button
                  type="button"
                  onClick={decreaseQty}
                  disabled={qty <= 1}
                  className="p-3 text-gray-600 hover:text-[var(--color-primary)] disabled:opacity-50 focus:outline-none"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  readOnly
                  value={qty}
                  className="w-12 text-center text-gray-900 font-medium border-none focus:ring-0 p-0"
                />
                <button
                  type="button"
                  onClick={increaseQty}
                  disabled={qty >= product.stock}
                  className="p-3 text-gray-600 hover:text-[var(--color-primary)] disabled:opacity-50 focus:outline-none"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, qty)}
                disabled={product.stock === 0}
                className="flex-1 bg-[var(--color-primary)] border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={() => {
                  if (!user) return;
                  isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product._id);
                }}
                className={`flex items-center justify-center p-3 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] ${isInWishlist(product._id) ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-red-500'}`}
              >
                <Heart className={`h-6 w-6 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center space-x-4 mb-8 text-gray-600 bg-gray-50 p-4 rounded-lg">
              <Truck className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                <p className="text-xs">Enter your postal code for delivery availability</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
              <div className="text-base text-gray-700 leading-relaxed space-y-4">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <dl className="divide-y divide-gray-200">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 flex items-center">
                        <dt className="text-sm font-medium text-gray-500 w-1/3 sm:w-auto">{spec.key}</dt>
                        <dd className="text-sm text-gray-900 sm:col-span-2">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-10 border-t border-[var(--color-border)]">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Reviews List */}
            <div className="lg:col-span-7">
              {product.reviews && product.reviews.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {product.reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="ml-3 text-sm font-medium text-gray-900">{review.name}</p>
                        <span className="mx-2 text-gray-300">•</span>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="lg:col-span-5">
              <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                
                {user ? (
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const config = { headers: { Authorization: `Bearer ${user.token}` } };
                        const rating = e.target.rating.value;
                        const comment = e.target.comment.value;
                        await axios.post(`/api/products/${product._id}/reviews`, { rating, comment }, config);
                        alert('Review submitted successfully!');
                        window.location.reload();
                      } catch (err) {
                        alert(err.response?.data?.message || 'Failed to submit review');
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                      <select 
                        id="rating" 
                        name="rating" 
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm rounded-md"
                      >
                        <option value="">Select...</option>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Review</label>
                      <textarea
                        id="comment"
                        name="comment"
                        rows="4"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[var(--color-primary)] text-white py-2 px-4 rounded-md font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">Please sign in to write a review.</p>
                    <Link
                      to="/login"
                      className="inline-block bg-white text-[var(--color-primary)] border border-[var(--color-primary)] py-2 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
