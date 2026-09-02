import { useCallback, useEffect, useState } from 'react';
import { apiGet, apiPost } from '../utils/api';

export function useTelegramBot(autoLoad = true) {
  const [status, setStatus] = useState({ connected: false, botUsername: null, chatId: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const getStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet('/api/telegram/status');
      setStatus(result?.data || { connected: false, botUsername: null, chatId: null });
      return result?.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await apiPost('/api/telegram/test');
      setTestResult({ success: true, message: result.message });
      return result;
    } catch (err) {
      setTestResult({ success: false, message: err.message });
      throw err;
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    if (autoLoad) getStatus();
  }, [autoLoad, getStatus]);

  return { status, loading, error, getStatus, refresh: getStatus, sendTest, testing, testResult };
}