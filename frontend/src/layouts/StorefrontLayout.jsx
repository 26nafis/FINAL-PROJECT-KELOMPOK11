import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 text-center text-xs text-gray-500">
          Penerapan Gemini AI dalam Pembuatan Deskripsi Produk E-Commerce &middot; Kelompok 11
        </div>
      </footer>
    </div>
  );
}

export default StorefrontLayout;
