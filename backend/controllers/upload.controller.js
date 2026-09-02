function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'File gambar tidak ditemukan'
    });
  }

  const url = `/uploads/${req.file.filename}`;

  res.json({
    success: true,
    message: 'Gambar berhasil diupload',
    data: { url }
  });
}

module.exports = { uploadImage };