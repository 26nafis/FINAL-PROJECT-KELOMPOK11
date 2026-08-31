const {
  GoogleGenerativeAI
} = require('@google/generative-ai');

const config = require('../config/env');

async function generateProductDescription(product) {
  if (!config.geminiApiKey) {
    throw new Error(
      'GEMINI_API_KEY belum diatur di file .env'
    );
  }

  const genAI =
    new GoogleGenerativeAI(
      config.geminiApiKey
    );

  const model =
    genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    });

  const prompt = `
Anda adalah copywriter profesional untuk website E-Commerce.

Buat deskripsi produk dalam Bahasa Indonesia yang:
- menarik
- profesional
- mudah dipahami
- informatif
- tidak berlebihan
- cocok untuk marketplace
- memiliki panjang 2 sampai 3 paragraf

Informasi produk:

Nama: ${product.name}
Kategori: ${product.category || '-'}
Harga: ${product.price || '-'}
Stok: ${product.stock || '-'}
Informasi tambahan: ${product.information || '-'}

Jangan membuat informasi yang tidak diberikan.
Jangan menyebut bahwa deskripsi dibuat oleh AI.
Hanya berikan deskripsi produk tanpa pembukaan tambahan.
`;

  const result =
    await model.generateContent(prompt);

  const response =
    await result.response;

  return response.text().trim();
}

module.exports = {
  generateProductDescription
};