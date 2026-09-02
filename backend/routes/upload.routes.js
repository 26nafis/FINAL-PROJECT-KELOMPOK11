const express = require('express');

const { uploadImage } = require('../controllers/upload.controller');
const { authenticate, adminOnly } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.post(
  '/',
  authenticate,
  adminOnly,
  upload.single('image'),
  uploadImage
);

module.exports = router;