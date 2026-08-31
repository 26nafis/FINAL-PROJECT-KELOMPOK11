const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const config = require('../config/env');

async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password wajib diisi'
      });
    }

    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'customer'
    });

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Gagal melakukan registrasi'
    });
  }
}

async function login(req, res) {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiresIn
      }
    );

    return res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Gagal melakukan login'
    });
  }
}

async function me(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id',
        'name',
        'email',
        'role',
        'createdAt'
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data user'
    });
  }
}

module.exports = {
  register,
  login,
  me
};