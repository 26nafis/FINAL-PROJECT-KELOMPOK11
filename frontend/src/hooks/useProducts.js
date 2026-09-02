import { useCallback, useEffect, useState } from 'react';
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
} from '../utils/api';

export function useProducts(autoLoad = true) {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * GET SEMUA PRODUK
   */
  const getProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiGet('/api/products');

      const data = Array.isArray(result.data)
        ? result.data
        : [];

      setProducts(data);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * GET DETAIL PRODUK
   */
  const getProduct = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiGet(`/api/products/${id}`);

      setProduct(result.data);

      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * TAMBAH PRODUK
   */
  const createProduct = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiPost(
        '/api/products',
        data
      );

      await getProducts();

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * UPDATE PRODUK
   */
  const updateProduct = async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiPut(
        `/api/products/${id}`,
        data
      );

      await getProducts();

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * HAPUS PRODUK
   */
  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiDelete(
        `/api/products/${id}`
      );

      await getProducts();

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * LOAD AWAL
   */
  useEffect(() => {
    if (autoLoad) {
      getProducts();
    }
  }, [autoLoad, getProducts]);

  return {
    products,
    product,
    loading,
    error,

    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,

    refresh: getProducts,
  };
}

