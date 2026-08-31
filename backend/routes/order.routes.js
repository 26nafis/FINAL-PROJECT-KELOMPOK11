const express = require('express');

const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus
} = require('../controllers/order.controller');

const {
  authenticate,
  adminOnly
} = require('../middleware/auth.middleware');

const router =
  express.Router();

router.post(
  '/',
  authenticate,
  createOrder
);

router.get(
  '/',
  authenticate,
  getOrders
);

router.get(
  '/:id',
  authenticate,
  getOrder
);

router.patch(
  '/:id/status',
  authenticate,
  adminOnly,
  updateOrderStatus
);

module.exports = router;