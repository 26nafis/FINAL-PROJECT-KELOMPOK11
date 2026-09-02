import { Routes, Route } from 'react-router-dom';

import StorefrontLayout from '../layouts/StorefrontLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminInvoices from '../pages/admin/AdminInvoices';
import AdminInvoiceDetail from '../pages/admin/AdminInvoiceDetail';
import AdminTelegramBot from '../pages/admin/AdminTelegramBot';

/**
 * Struktur routing:
 * - "/" dst.        -> StorefrontLayout (Navbar + Footer)  = tampilan customer
 * - "/admin" dst.   -> AdminLayout (sidebar)                = tampilan admin
 * - Login/Register  -> tanpa layout (halaman penuh)
 *
 * /cart, /orders/*  wajib login (ProtectedRoute) - customer & admin sama-sama boleh.
 * /admin/*          wajib login DAN role admin (AdminRoute).
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/invoices" element={<AdminInvoices />} />
          <Route path="/admin/invoices/:id" element={<AdminInvoiceDetail />} />
          <Route path="/admin/telegram-bot" element={<AdminTelegramBot />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
