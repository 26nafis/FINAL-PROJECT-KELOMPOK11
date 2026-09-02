import { useState } from 'react';
import { apiPost } from '../utils/api';

export function useGenerateDescription() {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const generateDescription = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      // Ubah endpoint agar sesuai dengan app.js backend (/api/ai/generate-description)
      const result = await apiPost('/api/ai/generate-description', payload); 
      
      // Ambil teks dari struktur res.json backend: result.data.description
      const generatedText = result?.data?.description || result?.description || '';
      
      setDescription(generatedText);
      return generatedText;
    } catch (err) {
      setError(err.message || 'Gagal membuat deskripsi');
    } finally {
      setLoading(false);
    }
  };

  return { generateDescription, description, loading, error, setDescription };
}