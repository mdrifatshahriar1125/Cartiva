import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--color-border)] overflow-hidden flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)] text-white">
              Featured
            </span>
          )}
          {product.originalPrice > product.price && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
              Sale
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-colors">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-sm font-medium text-[var(--color-secondary-text)] mb-1 uppercase tracking-wider">
              {product.brand}
            </h3>
            <Link to={`/products/${product._id}`} className="block">
              <h2 className="text-base font-bold text-[var(--color-main-text)] line-clamp-2 hover:text-[var(--color-primary)] transition-colors">
                {product.name}
              </h2>
            </Link>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center mt-auto pt-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-xs text-gray-500">({product.numReviews})</span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[var(--color-main-text)]">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button 
            className="flex items-center justify-center bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
            title="Add to Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
