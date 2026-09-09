import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/customer/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Products from './pages/customer/Products';
import ProductDetails from './pages/customer/ProductDetails';
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
            
            {/* Protected Routes Example */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="p-8 text-center">
                  <h1 className="text-2xl">Profile Page</h1>
                </div>
              </ProtectedRoute>
            } />

            {/* Admin Routes Example */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl">Admin Dashboard</h1>
                </div>
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
