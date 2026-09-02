const express = require('express');
const cors = require('cors');

const config = require('./config/env');
const { sequelize } = require('./models');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const aiRoutes = require('./routes/ai.routes');
const telegramRoutes = require('./routes/telegram.routes');

const app = express();

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Gemini AI E-Commerce API aktif',
    project: 'PENERAPAN GEMINI AI DALAM PEMBUATAN DESKRIPSI PRODUK E-COMMERCE'
  });
});

// Routing
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/telegram', telegramRoutes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL berhasil terhubung');

    await sequelize.sync();
    console.log('Database berhasil disinkronkan');

    app.listen(config.port, () => {
      console.log(`Backend jalan di http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('GAGAL MENJALANKAN SERVER:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;