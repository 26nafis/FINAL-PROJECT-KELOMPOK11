import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { formatRupiah, ORDER_STATUS_STYLE } from '../utils/format';

function Orders() {
  const { orders, loading } = useOrders();

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="text-2xl font-bold mb-8">Pesanan Saya</h1>

      {loading ? (
        <p className="text-gray-500 text-sm">Memuat pesanan...</p>
      ) : orders.length === 0 ? (
        <div className="border border-white/10 rounded-2xl p-16 text-center">
          <p className="text-gray-400 mb-6">Anda belum memiliki pesanan.</p>
          <Link to="/products" className="inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-semibold">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/orders/${o.id}`}
              className="border border-white/10 bg-white/[0.02] rounded-2xl p-5 flex items-center justify-between hover:bg-white/[0.04] transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{o.invoiceNumber}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(o.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-3 py-1 rounded-full border ${ORDER_STATUS_STYLE[o.status] || ''}`}>{o.status}</span>
                <p className="font-bold text-sm">{formatRupiah(o.total)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
