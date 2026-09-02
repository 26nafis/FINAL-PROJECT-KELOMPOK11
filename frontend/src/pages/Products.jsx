import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

function Products() {
  const { products, loading } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = [...new Set(products.map((p) => p.category))];
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) && (!category || p.category === category)
  );

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="text-2xl font-bold mb-1">Semua Produk</h1>
      <p className="text-sm text-gray-500 mb-8">Jelajahi katalog produk kami</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk..."
          className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/50 placeholder:text-gray-600"
        />
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !category ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === c ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Memuat produk...</p>
      ) : filtered.length === 0 ? (
        <div className="border border-white/10 rounded-2xl p-14 text-center text-gray-500 text-sm">
          Tidak ada produk yang cocok.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="border border-white/10 bg-white/[0.02] rounded-2xl overflow-hidden p-3 hover:bg-white/[0.04] hover:-translate-y-1 transition-all"
            >
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-white/10 flex items-center justify-center">
                <span className="text-3xl font-black text-blue-400/60">{p.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="pt-3">
                <span className="text-[11px] text-blue-400">{p.category}</span>
                <h3 className="text-sm font-semibold mt-0.5 line-clamp-1">{p.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm font-bold">{formatRupiah(p.price)}</p>
                  <span className="text-[11px] text-gray-500">{p.stock} stok</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
