import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import AdminPageHeader from '../../components/AdminPageHeader';
import { formatRupiah, ORDER_STATUS_STYLE } from '../../utils/format';

function AdminInvoiceDetail() {
  const { id } = useParams();
  const { getOrder } = useOrders(false);
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setOrder(null);
    setNotFound(false);
    getOrder(id).then(setOrder).catch(() => setNotFound(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      <AdminPageHeader
        title="Detail Invoice"
        actions={
          order && (
            <button onClick={() => window.print()} className="text-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5">
              Cetak / Simpan PDF
            </button>
          )
        }
      />

      <div className="p-8 max-w-3xl">
        <Link to="/admin/invoices" className="text-sm text-gray-500 hover:text-gray-300 mb-6 inline-block print:hidden">
          ← Kembali ke Invoice
        </Link>

        {notFound && <p className="text-gray-400 text-sm">Invoice tidak ditemukan.</p>}
        {!order && !notFound && <p className="text-gray-500 text-sm">Memuat...</p>}

        {order && (
          <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-black text-xs">G</span>
                  <span className="font-bold text-sm">Gemini Commerce</span>
                </div>
                <p className="text-xs text-gray-500">Penerapan Gemini AI dalam Pembuatan Deskripsi Produk E-Commerce</p>
              </div>
              <div className="text-right">
                <p className="font-bold">INVOICE</p>
                <p className="text-xs text-gray-500 mt-1">{order.invoiceNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Customer</p>
                <p>{order.user?.name || `User #${order.userId}`}</p>
                <p className="text-xs text-gray-500">{order.user?.email}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 mb-1">Status</p>
                <span className={`text-xs px-3 py-1 rounded-full border ${ORDER_STATUS_STYLE[order.status] || ''}`}>{order.status}</span>
              </div>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-gray-400 text-left">
                    <th className="px-4 py-3 font-medium">Item</th>
                    <th className="px-4 py-3 font-medium text-right">Harga</th>
                    <th className="px-4 py-3 font-medium text-right">Qty</th>
                    <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{item.product?.name || `Produk #${item.productId}`}</td>
                      <td className="px-4 py-3 text-gray-400 text-right">{formatRupiah(item.price)}</td>
                      <td className="px-4 py-3 text-gray-400 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">{formatRupiah(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-full sm:w-64 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminInvoiceDetail;
