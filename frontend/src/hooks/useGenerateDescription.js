import { useState } from 'react';
import { apiPost } from '../utils/api'; // pastikan ada apiPost di utils/api.js

export function useGenerateDescription() {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const generateDescription = async (payload) => {
    // payload berisi: { name, category, info }
    setLoading(true);
    setError(null);
    try {
      // Sesuaikan endpoint backend kamu (misal: /api/generate atau /generate-description)
      const result = await apiPost('/generate-description', payload); 
      
      // Ambil teks hasil generate (sesuaikan struktur JSON dari backend kamu)
      const generatedText = result.description || result.data;
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