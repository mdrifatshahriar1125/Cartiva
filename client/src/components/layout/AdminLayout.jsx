import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3 } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-gray-900 text-white">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <BarChart3 className="h-8 w-8 text-indigo-400" />
            <span className="ml-2 text-xl font-bold">Admin Panel</span>
          </div>
          <nav className="mt-2 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.path) 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${
                  isActive(item.path) ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-400'
                }`} />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <nav className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center px-2 py-1 text-xs ${
                isActive(item.path) ? 'text-indigo-400' : 'text-gray-500'
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
