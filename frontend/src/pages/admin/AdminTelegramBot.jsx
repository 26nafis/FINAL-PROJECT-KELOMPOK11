import AdminPageHeader from '../../components/AdminPageHeader';
import { useTelegramBot } from '../../hooks/useTelegramBot';

function AdminTelegramBot() {
  const { status, loading, sendTest, testing, testResult } = useTelegramBot();

  return (
    <div>
      <AdminPageHeader title="Telegram Bot" />

      <div className="p-8 max-w-3xl space-y-6">
        <section className="border border-white/10 bg-white/[0.02] rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Status Koneksi</h3>

          {loading ? (
            <p className="text-sm text-gray-500">Mengecek koneksi...</p>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <span className={`w-2.5 h-2.5 rounded-full ${status.connected ? 'bg-green-400' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-400">{status.connected ? 'Terhubung' : 'Belum terhubung'}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bot Username</p>
                  <p className="text-gray-300">{status.botUsername ? `@${status.botUsername}` : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Admin Chat ID</p>
                  <p className="text-gray-300">{status.chatId || '—'}</p>
                </div>
              </div>
            </>
          )}

          <button
            onClick={sendTest}
            disabled={!status.connected || testing}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl py-3 text-sm font-semibold transition"
          >
            {testing ? 'Mengirim...' : 'Kirim Pesan Test'}
          </button>

          {testResult && (
            <p className={`text-xs mt-3 ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
              {testResult.message}
            </p>
          )}
        </section>

        <section className="border border-white/10 bg-white/[0.02] rounded-2xl p-6">
          <h3 className="font-semibold mb-2">Notifikasi Pesanan</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Bot otomatis mengirim notifikasi ke Telegram admin setiap ada pesanan baru atau
            perubahan status pesanan, dipicu langsung dari <code className="text-gray-300">order.controller.js</code>.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AdminTelegramBot;