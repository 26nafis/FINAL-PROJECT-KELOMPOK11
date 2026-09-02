import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Layout admin (sidebar + topbar) dipakai buat semua halaman di bawah
 * /admin/*. Konten halamannya sendiri di-render lewat <Outlet /> oleh
 * react-router (lihat routes/index.jsx) - jadi tiap menu (Produk,
 * Pesanan, Invoice, Telegram Bot) itu HALAMAN BENERAN, bukan cuma
 * ganti teks header kayak versi mockup sebelumnya.
 */
const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: '⌂', end: true },
  { to: '/admin/products', label: 'Produk', icon: '▣' },
  { to: '/admin/orders', label: 'Pesanan', icon: '🛒' },
  { to: '/admin/invoices', label: 'Invoice', icon: '▤' },
  { to: '/admin/telegram-bot', label: 'Telegram Bot', icon: '✈' },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-white flex">
      {/* SIDEBAR */}
      <aside className="w-[250px] min-h-screen border-r border-white/10 bg-[#0b0f17] fixed left-0 top-0 flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-black text-lg">G</span>
            </div>
            <div>
              <h1 className="font-bold text-sm">Gemini Commerce</h1>
              <p className="text-[11px] text-gray-500">AI E-Commerce System</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 flex-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 px-3 mb-3">Main Menu</p>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                    isActive
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="w-5 text-center">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-6 px-3">
            <NavLink to="/" className="text-xs text-gray-500 hover:text-gray-300">
              &larr; Kembali ke toko
            </NavLink>
          </div>
        </div>

        <div className="p-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-gray-500 truncate">{user?.email || 'administrator'}</p>
              </div>
              <button onClick={handleLogout} title="Logout" className="text-gray-500 hover:text-red-400">
                ⏻
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-[250px] flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
