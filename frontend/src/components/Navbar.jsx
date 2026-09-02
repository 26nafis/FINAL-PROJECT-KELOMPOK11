import { Link, NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function NavItem({ to, children }) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      {children}
    </RouterNavLink>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080b12]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-black text-sm">
            G
          </span>
          <span className="font-bold text-white">Gemini Commerce</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/products">Produk</NavItem>
          {user && <NavItem to="/orders">Pesanan Saya</NavItem>}
          {user?.role === 'admin' && <NavItem to="/admin">Dashboard Admin</NavItem>}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20">
            🛒
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 rounded-full bg-blue-500 text-white text-[10px] leading-4 text-center font-semibold">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-gray-400">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="text-sm px-3 py-2 rounded-lg text-red-400 hover:bg-white/5">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm px-4 py-2 rounded-lg bg-white text-[#080b12] font-medium hover:bg-gray-200">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
