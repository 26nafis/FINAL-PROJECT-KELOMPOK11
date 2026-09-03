import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductThumb from '../components/ProductThumb';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

function Home() {
  const { products, loading } = useProducts();
  const featured = products.slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <span className="inline-flex items-center gap-2 text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-5">
            ✦ Gemini AI Integrated
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-2xl">
            Belanja Lebih Cerdas dengan <span className="text-blue-400">Gemini AI</span>
          </h1>
          <p className="text-gray-400 mt-5 max-w-xl leading-relaxed">
            Temukan produk terbaik dengan deskripsi yang dibuat otomatis oleh Gemini AI, jelas dan informatif.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition shadow-lg shadow-blue-500/20"
          >
            Mulai Belanja →
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Produk Unggulan</h2>
            <p className="text-sm text-gray-500 mt-1">Dideskripsikan dengan bantuan Gemini AI</p>
          </div>
          <Link to="/products" className="text-sm text-blue-400 hover:text-blue-300 hidden sm:block">
            Lihat semua →
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Memuat produk...</p>
        ) : featured.length === 0 ? (
          <div className="border border-white/10 rounded-2xl p-10 text-center text-gray-500 text-sm">
            Belum ada produk. Tambahkan lewat panel admin.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="border border-white/10 bg-white/[0.02] rounded-2xl overflow-hidden p-3 hover:bg-white/[0.04] hover:-translate-y-1 transition-all"
              >
                <ProductThumb imageUrl={p.imageUrl} name={p.name} className="aspect-[4/3] rounded-xl" />
                <div className="pt-3">
                  <span className="text-[11px] text-blue-400">{p.category}</span>
                  <h3 className="text-sm font-semibold mt-0.5 line-clamp-1">{p.name}</h3>
                  <p className="text-sm font-bold mt-1">{formatRupiah(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;