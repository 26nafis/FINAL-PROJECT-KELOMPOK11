const express = require('express');

const { getStatus, sendTest } = require('../controllers/telegram.controller');
const { authenticate, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/status', authenticate, adminOnly, getStatus);
router.post('/test', authenticate, adminOnly, sendTest);

module.exports = router;