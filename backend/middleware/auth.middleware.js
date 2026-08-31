const jwt = require('jsonwebtoken');
const config = require('../config/env');

function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan'
      });
    }

    const token = header.split(' ')[1];

    const decoded = jwt.verify(
      token,
      config.jwtSecret
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau sudah expired'
    });
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Akses hanya untuk admin'
    });
  }

  next();
}

module.exports = {
  authenticate,
  adminOnly
};