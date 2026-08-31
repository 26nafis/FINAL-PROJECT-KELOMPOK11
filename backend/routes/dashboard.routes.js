const express = require('express');

const {
  getDashboard
} = require('../controllers/dashboard.controller');

const {
  authenticate,
  adminOnly
} = require('../middleware/auth.middleware');

const router =
  express.Router();

router.get(
  '/',
  authenticate,
  adminOnly,
  getDashboard
);

module.exports = router;