import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
        {/* Navbar will go here */}
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<div className="p-8 text-center"><h1 className="text-4xl text-[var(--color-primary)] font-bold">Welcome to Cartiva</h1></div>} />
            {/* We will add more routes here later */}
          </Routes>
        </main>
        
        {/* Footer will go here */}
      </div>
    </Router>
  );
}

export default App;
