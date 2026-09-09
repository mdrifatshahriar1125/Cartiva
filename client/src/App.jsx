import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
        {/* Navbar will go here */}
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <div className="p-8 text-center">
                <h1 className="text-4xl text-[var(--color-primary)] font-bold mb-4">Welcome to Cartiva</h1>
                <p className="text-[var(--color-secondary-text)]">Everything You Need, All in One Place.</p>
              </div>
            } />
            
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
        
        {/* Footer will go here */}
      </div>
    </Router>
  );
}

export default App;
