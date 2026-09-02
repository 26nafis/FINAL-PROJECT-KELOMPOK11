const express = require('express');
const router = express.Router();

router.post('/generate-description', async (req, res) => {
  try {
    const { name, category, info } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nama produk wajib diisi'
      });
    }

    // Panggil logika Gemini AI kamu di sini
    const description = `Deskripsi AI untuk ${name} (${category || 'Umum'}): ${info || 'Produk pilihan terbaik dengan kualitas terjamin.'}`;

    return res.json({
      success: true,
      data: { description }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;