import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

function ProductDetail() {
  const { id } = useParams();
  const { getProduct } = useProducts(false); // false = jangan auto-load daftar semua produk
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    setQty(1);
    getProduct(id)
      .then(setProduct)
      .catch(() => setNotFound(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (notFound) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Produk tidak ditemukan.</p>
        <Link to="/products" className="text-blue-400 hover:text-blue-300 text-sm">
          Kembali ke Produk
        </Link>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-[50vh] flex items-center justify-center text-gray-500 text-sm">Memuat...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
      <Link to="/products" className="text-sm text-gray-500 hover:text-gray-300 mb-8 inline-block">
        ← Kembali ke Produk
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-white/10 flex items-center justify-center">
          <span className="text-7xl font-black text-blue-400/60">{product.name.charAt(0).toUpperCase()}</span>
        </div>

        <div>
          <span className="text-sm text-blue-400 font-medium">{product.category}</span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-2 mb-3">{product.name}</h1>
          <p className="text-2xl font-bold mb-6">{formatRupiah(product.price)}</p>

          {product.aiGenerated && (
            <span className="inline-flex items-center gap-1.5 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 mb-4">
              ✦ Deskripsi dibuat oleh Gemini AI
            </span>
          )}

          <p className="text-gray-400 leading-relaxed whitespace-pre-line mb-8">
            {product.description || 'Belum ada deskripsi untuk produk ini.'}
          </p>

          <div className="flex items-center justify-between border border-white/10 rounded-xl p-4 mb-6">
            <span className="text-sm text-gray-400">Stok tersedia</span>
            <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {product.stock > 0 ? `${product.stock} pcs` : 'Habis'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
              <button onClick={() => setQty((v) => Math.max(1, v - 1))} className="w-11 h-12 text-gray-400 hover:bg-white/5">
                −
              </button>
              <input
                type="number"
                value={qty}
                min={1}
                max={product.stock}
                onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))}
                className="w-12 h-12 bg-transparent text-center outline-none"
              />
              <button
                onClick={() => setQty((v) => Math.min(product.stock, v + 1))}
                className="w-11 h-12 text-gray-400 hover:bg-white/5"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl py-3 text-sm font-semibold transition"
            >
              {added ? '✓ Ditambahkan' : 'Tambah ke Keranjang'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
