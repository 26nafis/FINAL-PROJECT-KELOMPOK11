import { useState } from 'react';
import { useGenerateDescription } from '../hooks/useGenerateDescription';

const products = [
  {
    id: 1,
    name: 'Kopi Arabica Gayo',
    category: 'Coffee',
    price: 85000,
    stock: 24,
    status: 'Tersedia',
    description:
      'Kopi Arabica Gayo dengan aroma khas, cita rasa seimbang, dan tingkat keasaman yang lembut.'
  },
  {
    id: 2,
    name: 'Matcha Latte Premium',
    category: 'Minuman',
    price: 32000,
    stock: 18,
    status: 'Tersedia',
    description:
      'Matcha latte premium dengan rasa creamy, lembut, dan aroma matcha yang autentik.'
  },
  {
    id: 3,
    name: 'Chocolate Cookies',
    category: 'Snack',
    price: 25000,
    stock: 7,
    status: 'Stok Terbatas',
    description:
      'Cookies cokelat renyah dengan tekstur lembut di bagian dalam dan rasa cokelat yang intens.'
  },
  {
    id: 4,
    name: 'Caramel Macchiato',
    category: 'Coffee',
    price: 38000,
    stock: 15,
    status: 'Tersedia',
    description:
      'Perpaduan espresso, susu creamy, dan caramel yang memberikan rasa manis dan nikmat.'
  }
];

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
}

function Home() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [search, setSearch] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [productsData, setProductsData] = useState(products);

  // State Form AI Modal
  const [aiName, setAiName] = useState('');
  const [aiCategory, setAiCategory] = useState('');
  const [aiInfo, setAiInfo] = useState('');

  // Custom Hook AI
  const { generateDescription, description, loading, error, setDescription } =
    useGenerateDescription();

  // Fungsi saat tombol Generate AI diklik dari tabel/hero
  const handleOpenAIModal = (product = null) => {
    if (product) {
      setAiName(product.name || '');
      setAiCategory(product.category || '');
      setAiInfo(product.description || '');
    } else {
      setAiName('');
      setAiCategory('');
      setAiInfo('');
    }
    setDescription(''); // Reset preview sebelumnya
    setShowAI(true);
  };

  // Fungsi trigger ke backend
  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    if (!aiName || !aiInfo) {
      alert('Nama Produk dan Informasi Produk wajib diisi!');
      return;
    }

    await generateDescription({
      name: aiName,
      category: aiCategory,
      info: aiInfo
    });
  };

  const filteredProducts = productsData.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = productsData.reduce(
    (total, product) => total + product.stock,
    0
  );

  const menuItems = [
    { name: 'Dashboard', icon: '⌂' },
    { name: 'Produk', icon: '▣' },
    { name: 'Pesanan', icon: '🛒' },
    { name: 'Invoice', icon: '▤' },
    { name: 'Telegram Bot', icon: '✈' }
  ];

  return (
    <div className="min-h-screen bg-[#080b12] text-white flex">
      {/* SIDEBAR */}
      <aside className="w-[250px] min-h-screen border-r border-white/10 bg-[#0b0f17] fixed left-0 top-0">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-black text-lg">G</span>
            </div>

            <div>
              <h1 className="font-bold text-sm">Gemini Commerce</h1>
              <p className="text-[11px] text-gray-500">AI E-Commerce System</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 px-3 mb-3">
            Main Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                  activeMenu === item.name
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="w-5 text-center">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">
                A
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-[11px] text-gray-500 truncate">
                  administrator
                </p>
              </div>

              <span className="text-gray-500">⋮</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-[250px] flex-1">
        {/* HEADER */}
        <header className="h-[76px] border-b border-white/10 bg-[#080b12]/90 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-20">
          <div>
            <p className="text-xs text-gray-500">E-Commerce Management</p>
            <h2 className="text-lg font-semibold">{activeMenu}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">
                ⌕
              </span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk..."
                className="w-64 bg-white/[0.04] border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:border-blue-500/50 placeholder:text-gray-600"
              />
            </div>

            <button className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/10">
              🔔
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/15 via-cyan-500/5 to-transparent p-7 mb-7">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative max-w-3xl">
              <span className="inline-flex items-center gap-2 text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-4">
                ✦ Gemini AI Integrated
              </span>

              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                PENERAPAN GEMINI AI DALAM PEMBUATAN
                <span className="text-blue-400"> DESKRIPSI PRODUK E-COMMERCE</span>
              </h1>

              <p className="text-sm text-gray-400 mt-4 leading-6 max-w-2xl">
                Sistem E-Commerce berbasis web yang terintegrasi dengan
                Gemini AI untuk membantu membuat deskripsi produk secara
                otomatis, menarik, jelas, dan konsisten.
              </p>

              <button
                onClick={() => handleOpenAIModal()}
                className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition shadow-lg shadow-blue-500/20"
              >
                ✦ Generate Deskripsi AI
              </button>
            </div>
          </section>

          {/* STATISTICS */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
            <StatCard
              title="Total Produk"
              value={productsData.length}
              icon="▣"
              desc="Produk terdaftar"
            />

            <StatCard
              title="Total Stok"
              value={totalStock}
              icon="◈"
              desc="Item tersedia"
            />

            <StatCard
              title="Pesanan"
              value="128"
              icon="🛒"
              desc="+12% bulan ini"
            />

            <StatCard
              title="Pendapatan"
              value="Rp 12,8 Jt"
              icon="↗"
              desc="+18% bulan ini"
            />
          </section>

          {/* PRODUCT MANAGEMENT */}
          <section className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Product Management</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Kelola produk dan generate deskripsi menggunakan Gemini AI
                </p>
              </div>

              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                + Tambah Produk
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-6 py-4 text-xs font-medium text-gray-500">
                      Produk
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500">
                      Harga
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500">
                      Stok
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500">
                      AI Description
                    </th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-white/5 hover:bg-white/[0.025]"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 max-w-xs truncate">
                            {product.description}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {formatRupiah(product.price)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full ${
                            product.stock <= 10
                              ? 'bg-orange-500/10 text-orange-400'
                              : 'bg-green-500/10 text-green-400'
                          }`}
                        >
                          {product.stock} pcs
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpenAIModal(product)}
                          className="text-xs px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                        >
                          ✦ Generate
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-xs">
                            ✎
                          </button>

                          <button className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs">
                            ×
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TECHNOLOGY */}
          <section className="mt-7">
            <h3 className="text-sm font-semibold mb-4">
              Technology Stack
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
              {[
                'Node.js',
                'Express.js',
                'React',
                'Tailwind CSS',
                'PostgreSQL',
                'Sequelize',
                'Gemini AI',
                'Telegram Bot'
              ].map((tech) => (
                <div
                  key={tech}
                  className="border border-white/10 bg-white/[0.02] rounded-xl px-4 py-3 text-center text-xs text-gray-400"
                >
                  {tech}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* ADD PRODUCT MODAL */}
      {showAddProduct && (
        <Modal onClose={() => setShowAddProduct(false)}>
          <h3 className="text-lg font-semibold mb-1">Tambah Produk</h3>
          <p className="text-xs text-gray-500 mb-6">
            Masukkan informasi produk baru.
          </p>

          <div className="space-y-4">
            <Input label="Nama Produk" placeholder="Contoh: Kopi Arabica" />
            <Input label="Kategori" placeholder="Coffee" />
            <Input label="Harga" placeholder="85000" type="number" />
            <Input label="Stok" placeholder="20" type="number" />

            <button
              onClick={() => setShowAddProduct(false)}
              className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-3 text-sm font-semibold"
            >
              Simpan Produk
            </button>
          </div>
        </Modal>
      )}

      {/* AI MODAL */}
      {showAI && (
        <Modal onClose={() => setShowAI(false)}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              ✦
            </div>

            <div>
              <h3 className="font-semibold">Gemini AI</h3>
              <p className="text-xs text-gray-500">
                Product Description Generator
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Nama Produk"
              placeholder="Kopi Arabica Gayo"
              value={aiName}
              onChange={(e) => setAiName(e.target.value)}
            />
            <Input
              label="Kategori"
              placeholder="Coffee"
              value={aiCategory}
              onChange={(e) => setAiCategory(e.target.value)}
            />

            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Informasi Produk
              </label>

              <textarea
                rows="4"
                placeholder="Masukkan informasi atau karakteristik produk..."
                value={aiInfo}
                onChange={(e) => setAiInfo(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 resize-none"
              />
            </div>

            <button
              onClick={handleGenerateSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 disabled:opacity-50 rounded-xl py-3 text-sm font-semibold transition"
            >
              {loading ? 'Sedang Memproses...' : '✦ Generate Deskripsi'}
            </button>

            {error && (
              <p className="text-xs text-red-400 mt-1">{error}</p>
            )}

            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <p className="text-xs text-purple-300 mb-2">
                Preview AI Description
              </p>

              <p className="text-sm text-gray-300 leading-6 whitespace-pre-line">
                {description ||
                  'Hasil deskripsi dari AI akan muncul di sini setelah kamu klik tombol Generate.'}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, desc }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-5 hover:bg-white/[0.04] transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <p className="text-[11px] text-gray-600 mt-3">{desc}</p>
    </div>
  );
}

function Input({ label, placeholder, type = 'text', value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-2">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/50 placeholder:text-gray-700"
      />
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0d121c] border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex justify-end px-5 pt-5">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"
          >
            ×
          </button>
        </div>

        <div className="px-6 pb-7">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Home;