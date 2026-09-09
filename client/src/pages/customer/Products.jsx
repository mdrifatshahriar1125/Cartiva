import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/product/ProductCard';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentRating = searchParams.get('rating') || '';

  // Local state for filters before applying
  const [priceRange, setPriceRange] = useState(
    currentMinPrice === '0' && currentMaxPrice === '50' ? 'under50' :
    currentMinPrice === '50' && currentMaxPrice === '100' ? '50to100' :
    currentMinPrice === '100' ? 'over100' : ''
  );

  useEffect(() => {
    // Fetch categories for sidebar
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = '/api/products';
        const params = [];
        
        if (currentCategory) params.push(`category=${currentCategory}`);
        if (currentSearch) params.push(`keyword=${currentSearch}`);
        if (currentSort) params.push(`sort=${currentSort}`);
        if (currentMinPrice) params.push(`minPrice=${currentMinPrice}`);
        if (currentMaxPrice) params.push(`maxPrice=${currentMaxPrice}`);
        if (currentRating) params.push(`rating=${currentRating}`);
        params.push(`page=${page}`);
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }
        
        const { data } = await axios.get(url).catch(() => ({ data: { products: [], page: 1, pages: 1, count: 0 }}));
        setProducts(data.products || []);
        setPages(data.pages || 1);
        setTotalCount(data.count || 0);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentSearch, currentSort, currentMinPrice, currentMaxPrice, currentRating, page]);

  const updateURLParams = (key, value) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page on filter change
    if (key !== 'page') params.delete('page');
    setPage(1);
    navigate(`/products?${params.toString()}`);
  };

  const handlePriceChange = (val) => {
    setPriceRange(val);
    if (val === 'under50') {
      const params = new URLSearchParams(location.search);
      params.set('minPrice', '0');
      params.set('maxPrice', '50');
      params.delete('page');
      navigate(`/products?${params.toString()}`);
    } else if (val === '50to100') {
      const params = new URLSearchParams(location.search);
      params.set('minPrice', '50');
      params.set('maxPrice', '100');
      params.delete('page');
      navigate(`/products?${params.toString()}`);
    } else if (val === 'over100') {
      const params = new URLSearchParams(location.search);
      params.set('minPrice', '100');
      params.delete('maxPrice');
      params.delete('page');
      navigate(`/products?${params.toString()}`);
    } else {
      const params = new URLSearchParams(location.search);
      params.delete('minPrice');
      params.delete('maxPrice');
      params.delete('page');
      navigate(`/products?${params.toString()}`);
    }
  };

  const clearFilters = () => {
    setPriceRange('');
    navigate('/products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-[var(--color-border)]">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-main-text)]">
            {currentSearch ? `Search: "${currentSearch}"` : currentCategory ? `Category: ${categories.find(c => c.slug === currentCategory)?.name || currentCategory}` : 'All Products'}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-secondary-text)]">
            Showing {products.length} of {totalCount} products
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2 whitespace-nowrap">Sort by:</span>
            <select 
              value={currentSort}
              onChange={(e) => updateURLParams('sort', e.target.value)}
              className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm rounded-md border"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          
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
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center">
                <SlidersHorizontal className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
                <h2 className="text-lg font-bold text-[var(--color-main-text)]">Filters</h2>
              </div>
              {(currentCategory || currentMinPrice || currentRating || currentSearch) && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:underline font-medium">Clear All</button>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={currentCategory === ''} 
                      onChange={() => updateURLParams('category', '')}
                      className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" 
                    /> 
                    All Categories
                  </li>
                  {categories.map(c => (
                    <li key={c._id} className="flex items-center">
                      <input 
                        type="radio" 
                        name="category" 
                        checked={currentCategory === c.slug} 
                        onChange={() => updateURLParams('category', c.slug)}
                        className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" 
                      /> 
                      {c.name}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Price */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Price</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={priceRange === ''} 
                      onChange={() => handlePriceChange('')}
                      className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" 
                    /> 
                    Any Price
                  </li>
                  <li className="flex items-center">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={priceRange === 'under50'} 
                      onChange={() => handlePriceChange('under50')}
                      className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" 
                    /> 
                    Under $50
                  </li>
                  <li className="flex items-center">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={priceRange === '50to100'} 
                      onChange={() => handlePriceChange('50to100')}
                      className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" 
                    /> 
                    $50 to $100
                  </li>
                  <li className="flex items-center">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={priceRange === 'over100'} 
                      onChange={() => handlePriceChange('over100')}
                      className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" 
                    /> 
                    Over $100
                  </li>
                </ul>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Rating</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={currentRating === ''} 
                      onChange={() => updateURLParams('rating', '')}
                      className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" 
                    /> 
                    Any Rating
                  </li>
                  <li className="flex items-center">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={currentRating === '4'} 
                      onChange={() => updateURLParams('rating', '4')}
                      className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" 
                    /> 
                    4 Stars & Up
                  </li>
                  <li className="flex items-center">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={currentRating === '3'} 
                      onChange={() => updateURLParams('rating', '3')}
                      className="mr-2 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" 
                    /> 
                    3 Stars & Up
                  </li>
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
                <p className="text-gray-500 mb-4">Select filters and close to apply.</p>
                {/* Same filters for mobile, simplified for brevity */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                    <select 
                      value={currentCategory} 
                      onChange={(e) => updateURLParams('category', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] border p-2"
                    >
                      <option value="">All Categories</option>
                      {categories.map(c => (
                        <option key={c._id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    onClick={() => { clearFilters(); setIsFilterOpen(false); }}
                    className="w-full mt-4 bg-red-100 text-red-600 font-medium py-2 rounded-md hover:bg-red-200"
                  >
                    Clear All
                  </button>
                </div>
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
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-[var(--color-border)] flex flex-col items-center">
              <Search className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                onClick={clearFilters}
                className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-md font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {pages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(pages).keys()].map(x => (
                      <button 
                        key={x + 1}
                        onClick={() => setPage(x + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === x + 1 
                            ? 'z-10 bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary-dark)]' 
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {x + 1}
                      </button>
                    ))}

                    <button 
                      onClick={() => setPage(p => Math.min(pages, p + 1))}
                      disabled={page === pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
