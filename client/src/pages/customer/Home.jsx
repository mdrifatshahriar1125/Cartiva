import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real scenario, you'd fetch these from your backend
  // For now, we'll just mock them or fetch them if endpoints exist
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Since we don't have category/product routes fully wired in frontend yet,
        // we'll leave this empty or mock it for now, then hook it up.
        // Let's assume the API routes are working
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('/api/products?featured=true&limit=8').catch(() => ({ data: { products: [] } })),
          axios.get('/api/categories').catch(() => ({ data: [] }))
        ]);
        
        setFeaturedProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[var(--color-bg)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl tracking-tight font-extrabold text-[var(--color-main-text)] sm:text-5xl md:text-6xl mb-6">
              <span className="block">Everything You Need,</span>
              <span className="block text-[var(--color-primary)]">All in One Place.</span>
            </h1>
            <p className="mt-3 text-base text-[var(--color-secondary-text)] sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl mb-8">
              Discover quality products at prices you'll love. Shop from our curated collection of premium goods with fast shipping and secure payments.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center gap-4">
              <Link
                to="/products"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] md:py-4 md:text-lg md:px-10 shadow-lg shadow-indigo-200 transition-all"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/categories"
                className="w-full mt-3 sm:mt-0 flex items-center justify-center px-8 py-3 border border-[var(--color-primary)] text-base font-medium rounded-md text-[var(--color-primary)] bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-[var(--color-main-text)]">Free Shipping</h3>
              <p className="mt-2 text-sm text-[var(--color-secondary-text)]">On orders over $100</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-[var(--color-main-text)]">Secure Payment</h3>
              <p className="mt-2 text-sm text-[var(--color-secondary-text)]">100% secure checkout</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-[var(--color-main-text)]">24/7 Support</h3>
              <p className="mt-2 text-sm text-[var(--color-secondary-text)]">Dedicated help desk</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] mb-4">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-[var(--color-main-text)]">Easy Returns</h3>
              <p className="mt-2 text-sm text-[var(--color-secondary-text)]">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[var(--color-main-text)] tracking-tight">Shop by Category</h2>
            <div className="mt-2 h-1 w-24 bg-[var(--color-primary)] mx-auto rounded-full"></div>
          </div>
          
          {loading ? (
            <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.length > 0 ? categories.map((category) => (
                <Link key={category._id} to={`/products?category=${category.slug}`} className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="aspect-w-3 aspect-h-2 relative h-48">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all"></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{category.name}</h3>
                    <p className="text-white text-sm text-center drop-shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">{category.description}</p>
                  </div>
                </Link>
              )) : (
                <div className="col-span-3 text-center text-gray-500 py-10">Categories will appear here once added.</div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-white py-16 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--color-primary)] rounded-3xl overflow-hidden shadow-xl">
            <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:py-16">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Sign up for our newsletter
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-indigo-100">
                  Stay updated with the latest products, exclusive deals, and more!
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8 lg:flex-1">
                <form className="sm:flex">
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-5 py-3 border border-transparent rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--color-primary)] sm:max-w-xs"
                    placeholder="Enter your email"
                  />
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[var(--color-primary)] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-primary)] focus:ring-white transition-colors"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
