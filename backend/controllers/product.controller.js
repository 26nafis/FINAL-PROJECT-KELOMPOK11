const { Product } = require('../models');
const { generateProductDescription } = require('../services/gemini.service');

async function getProducts(req, res) {
  try {
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('GET PRODUCTS ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil produk'
    });
  }
}

async function getProduct(req, res) {
  try {
    const product = await Product.findByPk(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail produk'
    });
  }
}

async function createProduct(req, res) {
  try {
    const {
      name,
      category,
      price,
      stock,
      description
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Nama, kategori, dan harga wajib diisi'
      });
    }

    const product = await Product.create({
      name,
      category,
      price,
      stock: stock || 0,
      description: description || null,
      aiGenerated: false
    });

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: product
    });
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan produk'
    });
  }
}

async function updateProduct(req, res) {
  try {
    const product = await Product.findByPk(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    await product.update(req.body);

    res.json({
      success: true,
      message: 'Produk berhasil diperbarui',
      data: product
    });
  } catch (error) {
    console.error('UPDATE PRODUCT ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui produk'
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findByPk(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Produk berhasil dihapus'
    });
  } catch (error) {
    console.error('DELETE PRODUCT ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Gagal menghapus produk'
    });
  }
}

async function generateDescription(req, res) {
  try {
    const {
      name,
      category,
      price,
      stock,
      information
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nama produk wajib diisi'
      });
    }

    const description =
      await generateProductDescription({
        name,
        category,
        price,
        stock,
        information
      });

    res.json({
      success: true,
      message: 'Deskripsi berhasil dibuat oleh Gemini AI',
      data: {
        description
      }
    });
  } catch (error) {
    console.error('GEMINI ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Gagal membuat deskripsi AI'
    });
  }
}

async function generateAndSaveDescription(req, res) {
  try {
    const product = await Product.findByPk(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    const description =
      await generateProductDescription({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock
      });

    await product.update({
      description,
      aiGenerated: true
    });

    res.json({
      success: true,
      message: 'Deskripsi AI berhasil disimpan',
      data: product
    });
  } catch (error) {
    console.error(
      'GENERATE SAVE DESCRIPTION ERROR:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message || 'Gagal membuat deskripsi AI'
    });
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  generateDescription,
  generateAndSaveDescription
};