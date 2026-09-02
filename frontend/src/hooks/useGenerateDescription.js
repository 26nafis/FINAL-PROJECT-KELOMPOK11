import { useState } from 'react';
import { apiPost } from '../utils/api';

/**
 * PERBAIKAN: sebelumnya hook ini manggil '/api/ai/generate-description',
 * yaitu endpoint DUMMY di routes/ai.routes.js (cuma nge-gabung string,
 * bukan Gemini beneran). Endpoint yang benar-benar manggil Gemini AI
 * ada di product.controller.js -> '/api/products/generate-description'
 * (butuh login sebagai admin - token diambil otomatis oleh apiPost
 * dari localStorage lewat utils/api.js).
 *
 * Payload juga disesuaikan: backend expect { name, category, price,
 * stock, information } - bukan { name, category, info }.
 */
export function useGenerateDescription() {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const generateDescription = async ({ name, category, price, stock, info }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost('/api/products/generate-description', {
        name,
        category,
        price,
        stock,
        information: info,
      });

      const generatedText = result?.data?.description || '';
      setDescription(generatedText);
      return generatedText;
    } catch (err) {
      setError(err.message || 'Gagal membuat deskripsi');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Untuk produk yang SUDAH ADA di database: generate + langsung simpan
   * ke kolom description produk itu (satu request, endpoint
   * POST /api/products/:id/generate-description).
   */
  const generateAndSave = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost(`/api/products/${productId}/generate-description`);
      setDescription(result?.data?.description || '');
      return result.data;
    } catch (err) {
      setError(err.message || 'Gagal membuat deskripsi');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateDescription, generateAndSave, description, loading, error, setDescription };
}
