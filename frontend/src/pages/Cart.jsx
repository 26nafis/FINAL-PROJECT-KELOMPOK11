import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../context/AuthContext';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

function Cart() {
  const { items, total, updateQuantity, removeItem, clear } = useCart();
  const { createOrder } = useOrders(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setError('');
    setSubmitting(true);
    try {
      // Backend POST /api/orders cuma butuh { items: [{ productId, quantity }] }
      const payload = items.map((i) => ({ productId: i.productId, quantity: i.quantity }));
      const res = await createOrder(payload);
      clear();
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      setError(err.message || 'Checkout gagal, coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="text-2xl font-bold mb-8">Keranjang Belanja</h1>

      {items.length === 0 ? (
        <div className="border border-white/10 rounded-2xl p-16 text-center">
          <p className="text-gray-400 mb-6">Keranjang Anda masih kosong.</p>
          <Link to="/products" className="inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-semibold">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="border border-white/10 bg-white/[0.02] rounded-2xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="font-black text-blue-400/60">{item.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatRupiah(item.price)}</p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, Number(e.target.value) || 1)}
                  className="w-16 bg-white/[0.04] border border-white/10 rounded-lg text-center py-2 text-sm outline-none"
                />
                <p className="text-sm font-semibold w-28 text-right">{formatRupiah(item.price * item.quantity)}</p>
                <button onClick={() => removeItem(item.productId)} className="text-gray-500 hover:text-red-400 shrink-0">
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-6 h-fit">
            <h2 className="font-semibold mb-4">Ringkasan</h2>
            <div className="flex items-center justify-between text-sm text-gray-400 mb-5">
              <span>Total</span>
              <span className="text-white font-bold text-lg">{formatRupiah(total)}</span>
            </div>

            {error && <p className="text-xs text-red-400 mb-4">{error}</p>}

            {user ? (
              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl py-3 text-sm font-semibold transition"
              >
                {submitting ? 'Memproses...' : 'Checkout Sekarang'}
              </button>
            ) : (
              <Link
                to="/login"
                state={{ from: { pathname: '/cart' } }}
                className="block text-center w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-3 text-sm font-semibold transition"
              >
                Login untuk Checkout
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
