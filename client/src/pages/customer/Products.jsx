import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/product/ProductCard';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // We simulate query building for now until the backend handles it all
        let url = '/api/products';
        const params = [];
        if (categoryParam) params.push(`category=${categoryParam}`);
        if (searchParam) params.push(`keyword=${searchParam}`);
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }
        
        const { data } = await axios.get(url).catch(() => ({ data: { products: [] }}));
        setProducts(data.products || []);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, searchParam]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-[var(--color-border)]">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-main-text)]">
            {searchParam ? `Search: "${searchParam}"` : categoryParam ? `Category: ${categoryParam}` : 'All Products'}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-secondary-text)]">
            Showing {products.length} products
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          {/* Sort Dropdown (Mock UI) */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Sort by:</span>
            <select className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm rounded-md">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </div>
          
          {/* Mobile Filter Button */}
          <button 
            className="md:hidden flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-[var(--color-border)] sticky top-24">
            <div className="flex items-center mb-4">
              <SlidersHorizontal className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
              <h2 className="text-lg font-bold text-[var(--color-main-text)]">Filters</h2>
            </div>
            
            {/* Mock Filter Sections */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><input type="checkbox" className="mr-2 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]" /> Electronics</li>
                  <li className="flex items-center"><input type="checkbox" className="mr-2 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]" /> Fashion</li>
                  <li className="flex items-center"><input type="checkbox" className="mr-2 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]" /> Home & Living</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><input type="radio" name="price" className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" /> Under $50</li>
                  <li className="flex items-center"><input type="radio" name="price" className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" /> $50 to $100</li>
                  <li className="flex items-center"><input type="radio" name="price" className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" /> Over $100</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Rating</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><input type="radio" name="rating" className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" /> 4 Stars & Up</li>
                  <li className="flex items-center"><input type="radio" name="rating" className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" /> 3 Stars & Up</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsFilterOpen(false)}></div>
            <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-4 border-t border-gray-200 px-4 py-6">
                <p className="text-gray-500">Filter options will be fully functional soon.</p>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-8 bg-red-50 rounded-lg border border-red-100">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-[var(--color-border)]">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          {/* Pagination (Mock) */}
          {products.length > 0 && (
            <div className="mt-12 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-[var(--color-primary)] bg-[var(--color-primary-light)] text-sm font-medium text-[var(--color-primary-dark)] z-10">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
