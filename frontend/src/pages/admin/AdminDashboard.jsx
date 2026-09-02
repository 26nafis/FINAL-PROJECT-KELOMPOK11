import { Link } from 'react-router-dom';
import { useDashboard } from '../../hooks/useDashboard';
import { useProducts } from '../../hooks/useProducts';
import AdminPageHeader from '../../components/AdminPageHeader';
import { formatRupiah } from '../../utils/format';

function StatCard({ title, value, icon, desc }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-5 hover:bg-white/[0.04] transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-[11px] text-gray-600 mt-3">{desc}</p>
    </div>
  );
}

function AdminDashboard() {
  const { dashboard, loading } = useDashboard();
  const { products } = useProducts();

  const recentProducts = products.slice(0, 5);

  return (
    <div>
      <AdminPageHeader title="Dashboard" />

      <div className="p-8">
        <section className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/15 via-cyan-500/5 to-transparent p-7 mb-7">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-4">
              ✦ Gemini AI Integrated
            </span>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              PENERAPAN GEMINI AI DALAM PEMBUATAN <span className="text-blue-400">DESKRIPSI PRODUK E-COMMERCE</span>
            </h1>
            <p className="text-sm text-gray-400 mt-4 leading-6 max-w-2xl">
              Sistem E-Commerce yang terintegrasi dengan Gemini AI untuk membuat deskripsi produk otomatis.
            </p>
            <Link
              to="/admin/products"
              className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition shadow-lg shadow-blue-500/20"
            >
              Kelola Produk →
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
          <StatCard title="Total Produk" value={loading ? '...' : dashboard.totalProducts} icon="▣" desc="Produk terdaftar" />
          <StatCard title="Total Stok" value={loading ? '...' : dashboard.totalStock} icon="◈" desc="Item tersedia" />
          <StatCard title="Total Pesanan" value={loading ? '...' : dashboard.totalOrders} icon="🛒" desc="Semua status" />
          <StatCard title="Pendapatan" value={loading ? '...' : formatRupiah(dashboard.revenue)} icon="↗" desc="Dari pesanan completed" />
        </section>

        <section className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-semibold">Produk Terbaru</h3>
            <Link to="/admin/products" className="text-xs text-blue-400 hover:text-blue-300">Lihat semua →</Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentProducts.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-500 text-center">Belum ada produk.</p>
            ) : (
              recentProducts.map((p) => (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.category}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatRupiah(p.price)}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
