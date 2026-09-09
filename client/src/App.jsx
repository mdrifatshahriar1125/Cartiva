import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/customer/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Products from './pages/customer/Products';
import ProductDetails from './pages/customer/ProductDetails';
import Cart from './pages/customer/Cart';
import Wishlist from './pages/customer/Wishlist';
import Checkout from './pages/customer/Checkout';
import OrderSuccess from './pages/customer/OrderSuccess';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Cart (accessible without login) */}
            <Route path="/cart" element={<Cart />} />

            {/* Protected Customer Routes */}
            <Route path="/wishlist" element={
              <ProtectedRoute><Wishlist /></ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute><Checkout /></ProtectedRoute>
            } />
            <Route path="/order-success/:id" element={
              <ProtectedRoute><OrderSuccess /></ProtectedRoute>
            } />

            {/* Placeholder routes for profile, orders, admin — will be added in next phases */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Profile Page (Coming in Phase 8)</h1></div>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold">My Orders (Coming in Phase 7)</h1></div>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Admin Dashboard (Coming in Phase 9)</h1></div>
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
