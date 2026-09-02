import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import AdminPageHeader from '../../components/AdminPageHeader';
import { formatRupiah, ORDER_STATUS_STYLE, ORDER_STATUSES } from '../../utils/format';

function AdminOrders() {
  const { orders, loading, updateOrderStatus } = useOrders();
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Pesanan" />

      <div className="p-8">
        <section className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Invoice</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Total</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Tanggal</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Detail</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">Memuat...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">Belum ada pesanan.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.025]">
                      <td className="px-6 py-4 text-sm font-medium">{order.invoiceNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{order.user?.name || `User #${order.userId}`}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{formatRupiah(order.total)}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none disabled:opacity-50 ${ORDER_STATUS_STYLE[order.status] || ''}`}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-[#0d121c] text-white">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/admin/invoices/${order.id}`} className="text-xs text-blue-400 hover:text-blue-300">
                          Lihat →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminOrders;
