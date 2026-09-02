
import { useCallback, useEffect, useState } from 'react';
import {
  apiGet,
  apiPatch,
  apiPost,
} from '../utils/api';

export function useOrders(autoLoad = true) {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * GET ORDERS
   */
  const getOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiGet('/api/orders');

      const data = Array.isArray(result.data)
        ? result.data
        : [];

      setOrders(data);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * GET DETAIL ORDER
   */
  const getOrder = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiGet(
        `/api/orders/${id}`
      );

      setOrder(result.data);

      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * BUAT ORDER
   *
   * Backend mengharapkan:
   * {
   *   items: [
   *     {
   *       productId: 1,
   *       quantity: 2
   *     }
   *   ]
   * }
   */
  const createOrder = async (items) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiPost(
        '/api/orders',
        {
          items,
        }
      );

      await getOrders();

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * UPDATE STATUS ORDER
   */
  const updateOrderStatus = async (
    id,
    status
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiPatch(
        `/api/orders/${id}/status`,
        {
          status,
        }
      );

      await getOrders();

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      getOrders();
    }
  }, [autoLoad, getOrders]);

  return {
    orders,
    order,
    loading,
    error,

    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,

    refresh: getOrders,
  };
}

