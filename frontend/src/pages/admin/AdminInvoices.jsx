import { Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import AdminPageHeader from '../../components/AdminPageHeader';
import { formatRupiah, ORDER_STATUS_STYLE } from '../../utils/format';

/**
 * Backend gak punya tabel/model Invoice terpisah - tiap Order SUDAH
 * berperan sebagai invoice (field `invoiceNumber` ada langsung di
 * model Order). Jadi halaman ini nampilin daftar order yang sama kayak
 * "Pesanan", tapi fokusnya ke invoice number + total buat ditelusuri/
 * dicetak satu-satu di /admin/invoices/:id.
 */
function AdminInvoices() {
  const { orders, loading } = useOrders();

  return (
    <div>
      <AdminPageHeader title="Invoice" />

      <div className="p-8">
        <section className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">No. Invoice</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Tanggal</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Total</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">Memuat...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">Belum ada invoice.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.025]">
                      <td className="px-6 py-4 text-sm font-medium">{order.invoiceNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{order.user?.name || `User #${order.userId}`}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${ORDER_STATUS_STYLE[order.status] || ''}`}>{order.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">{formatRupiah(order.total)}</td>
                      <td className="px-6 py-4">
                        <Link to={`/admin/invoices/${order.id}`} className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20">
                          Lihat Invoice
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

export default AdminInvoices;
