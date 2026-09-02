import { useState, useRef } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useGenerateDescription } from '../../hooks/useGenerateDescription';
import AdminPageHeader from '../../components/AdminPageHeader';
import { formatRupiah } from '../../utils/format';
import { apiUpload, resolveImageUrl } from '../../utils/api';

const EMPTY_FORM = { name: '', category: '', price: '', stock: '', description: '', imageUrl: '' };

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0d121c] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end px-5 pt-5">
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400">×</button>
        </div>
        <div className="px-6 pb-7">{children}</div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-2">{label}</label>
      <input
        {...props}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/50 placeholder:text-gray-700"
      />
    </div>
  );
}

function ProductThumb({ imageUrl, name, size = 'w-full h-full' }) {
  const src = resolveImageUrl(imageUrl);
  if (src) {
    return <img src={src} alt={name} className={`${size} object-cover`} />;
  }
  return (
    <div className={`${size} bg-gradient-to-br from-blue-500/20 to-cyan-400/10 flex items-center justify-center`}>
      <span className="font-black text-blue-400/60">{name?.charAt(0).toUpperCase()}</span>
    </div>
  );
}

function AdminProducts() {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { generateDescription, generateAndSave, description, loading: aiLoading, error: aiError, setDescription } =
    useGenerateDescription();

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [regeneratingId, setRegeneratingId] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const resetImageState = () => {
    setImagePreview(null);
    setUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDescription('');
    setFormError('');
    resetImageState();
    setFormOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      description: p.description || '',
      imageUrl: p.imageUrl || '',
    });
    setDescription(p.description || '');
    setFormError('');
    resetImageState();
    setFormOpen(true);
  };

  const handlePickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploadingImage(true);
    setFormError('');

    try {
      const result = await apiUpload('/api/upload', file);
      setForm((f) => ({ ...f, imageUrl: result.data.url }));
    } catch (err) {
      setFormError(err.message || 'Gagal upload gambar.');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setForm((f) => ({ ...f, imageUrl: '' }));
    resetImageState();
  };

  const handleGenerateInModal = async () => {
    if (!form.name) {
      setFormError('Isi nama produk dulu sebelum generate deskripsi.');
      return;
    }
    setFormError('');
    try {
      const text = await generateDescription({
        name: form.name,
        category: form.category,
        price: form.price,
        stock: form.stock,
        info: form.description,
      });
      setForm((f) => ({ ...f, description: text }));
    } catch {
      // error sudah ditangkap di aiError
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || form.price === '') {
      setFormError('Nama, kategori, dan harga wajib diisi.');
      return;
    }
    if (uploadingImage) {
      setFormError('Tunggu upload gambar selesai dulu.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        description: form.description || null,
        imageUrl: form.imageUrl || null,
      };
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct({ ...payload, aiGenerated: Boolean(description) });
      }
      setFormOpen(false);
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan produk.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Hapus produk "${p.name}"?`)) return;
    await deleteProduct(p.id);
  };

  const handleRegenerate = async (p) => {
    setRegeneratingId(p.id);
    try {
      await generateAndSave(p.id);
    } catch {
      // biarin
    } finally {
      setRegeneratingId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Produk"
        actions={
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="w-64 bg-white/[0.04] border border-white/10 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-blue-500/50 placeholder:text-gray-600"
            />
            <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl text-sm font-semibold transition">
              + Tambah Produk
            </button>
          </>
        }
      />

      <div className="p-8">
        <section className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Produk</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Kategori</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Harga</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Stok</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">AI Description</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">Memuat...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">Belum ada produk.</td></tr>
                ) : (
                  filtered.map((product) => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.025]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg overflow-hidden border border-white/10 shrink-0">
                            <ProductThumb imageUrl={product.imageUrl} name={product.name} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-gray-600 mt-0.5 max-w-xs truncate">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="text-xs text-gray-400">{product.category}</span></td>
                      <td className="px-6 py-4 text-sm">{formatRupiah(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${product.stock <= 10 ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>
                          {product.stock} pcs
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRegenerate(product)}
                          disabled={regeneratingId === product.id}
                          className="text-xs px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 disabled:opacity-50"
                        >
                          {regeneratingId === product.id ? 'Membuat...' : '✦ Generate'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(product)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-xs">✎</button>
                          <button onClick={() => handleDelete(product)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs">×</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {formOpen && (
        <Modal onClose={() => setFormOpen(false)}>
          <h3 className="text-lg font-semibold mb-1">{editingId ? 'Edit Produk' : 'Tambah Produk'}</h3>
          <p className="text-xs text-gray-500 mb-6">
            Isi info produk, lalu opsional generate deskripsi pakai Gemini AI.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Gambar Produk</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] shrink-0 relative">
                  {imagePreview || form.imageUrl ? (
                    <img
                      src={imagePreview || resolveImageUrl(form.imageUrl)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                      Belum ada
                    </div>
                  )}
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-white">
                      Upload...
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handlePickImage}
                    className="block w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:cursor-pointer cursor-pointer"
                  />
                  {form.imageUrl && (
                    <button type="button" onClick={handleRemoveImage} className="text-xs text-red-400 hover:text-red-300">
                      Hapus gambar
                    </button>
                  )}
                  <p className="text-[11px] text-gray-600">JPG, PNG, WEBP, atau GIF. Maks 5MB.</p>
                </div>
              </div>
            </div>

            <Input label="Nama Produk" placeholder="Contoh: Kopi Arabica" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Kategori" placeholder="Coffee" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Harga" type="number" placeholder="85000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <Input label="Stok" type="number" placeholder="20" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs text-gray-400">Deskripsi</label>
                <button
                  type="button"
                  onClick={handleGenerateInModal}
                  disabled={aiLoading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 disabled:opacity-50"
                >
                  {aiLoading ? 'Membuat...' : '✦ Generate dengan AI'}
                </button>
              </div>
              <textarea
                rows="4"
                placeholder="Deskripsi produk, atau klik Generate dengan AI"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 resize-none"
              />
              {aiError && <p className="text-xs text-red-400 mt-2">{aiError}</p>}
            </div>

            {formError && <p className="text-xs text-red-400">{formError}</p>}

            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl py-3 text-sm font-semibold transition"
            >
              {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Simpan Produk'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default AdminProducts;