import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[var(--color-border)] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-[var(--color-primary)] tracking-tighter">
              Cartiva
            </Link>
            <p className="text-sm text-[var(--color-secondary-text)] pr-4">
              "Everything You Need, All in One Place."
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <span className="sr-only">Facebook</span>
                <span className="font-bold text-lg">FB</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <span className="sr-only">Instagram</span>
                <span className="font-bold text-lg">IG</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <span className="sr-only">Twitter</span>
                <span className="font-bold text-lg">TW</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <span className="sr-only">YouTube</span>
                <span className="font-bold text-lg">YT</span>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-main-text)] tracking-wider uppercase mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary)] transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary)] transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/products?featured=true" className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary)] transition-colors">Featured Deals</Link>
              </li>
              <li>
                <Link to="/products?sort=newest" className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary)] transition-colors">New Arrivals</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-main-text)] tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary)] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary)] transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary)] transition-colors">Careers</Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary)] transition-colors">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-main-text)] tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary)] transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary)] transition-colors">Shipping Information</Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary)] transition-colors">Returns & Exchanges</Link>
              </li>
              <li className="flex items-center text-sm text-[var(--color-secondary-text)] mt-4">
                <Mail className="h-4 w-4 mr-2" /> support@cartiva.com
              </li>
              <li className="flex items-center text-sm text-[var(--color-secondary-text)]">
                <Phone className="h-4 w-4 mr-2" /> +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-[var(--color-secondary-text)]">
            &copy; 2026 Cartiva. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary)] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary)] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
