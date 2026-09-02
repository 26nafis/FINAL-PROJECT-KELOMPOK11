```javascript
import { useCallback, useEffect, useState } from 'react';
import { apiGet } from '../utils/api';

export function useDashboard(autoLoad = true) {
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalStock: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiGet(
        '/api/dashboard'
      );

      setDashboard(
        result?.data || {
          totalProducts: 0,
          totalOrders: 0,
          totalStock: 0,
          revenue: 0,
        }
      );

      return result?.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      getDashboard();
    }
  }, [autoLoad, getDashboard]);

  return {
    dashboard,
    loading,
    error,
    getDashboard,
    refresh: getDashboard,
  };
}
```
