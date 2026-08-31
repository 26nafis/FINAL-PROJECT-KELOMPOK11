const express = require('express');

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  generateDescription,
  generateAndSaveDescription
} = require('../controllers/product.controller');

const {
  authenticate,
  adminOnly
} = require('../middleware/auth.middleware');

const router =
  express.Router();

router.get(
  '/',
  getProducts
);

router.get(
  '/:id',
  getProduct
);

router.post(
  '/',
  authenticate,
  adminOnly,
  createProduct
);

router.put(
  '/:id',
  authenticate,
  adminOnly,
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  adminOnly,
  deleteProduct
);

router.post(
  '/generate-description',
  authenticate,
  adminOnly,
  generateDescription
);

router.post(
  '/:id/generate-description',
  authenticate,
  adminOnly,
  generateAndSaveDescription
);

module.exports = router;