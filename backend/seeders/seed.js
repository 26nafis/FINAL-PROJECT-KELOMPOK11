require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

/**
 * Bikin 1 akun admin + 1 akun customer contoh, biar gak perlu daftar
 * manual/lewat curl buat nyoba. Jalankan dengan: npm run seed
 */
async function seed() {
  await sequelize.sync();

  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  await User.findOrCreate({
    where: { email: 'admin@geminicommerce.com' },
    defaults: { name: 'Admin', email: 'admin@geminicommerce.com', password: adminPassword, role: 'admin' },
  });

  await User.findOrCreate({
    where: { email: 'customer@geminicommerce.com' },
    defaults: { name: 'Budi Customer', email: 'customer@geminicommerce.com', password: customerPassword, role: 'customer' },
  });

  console.log('Seeding selesai.');
  console.log('Admin    : admin@geminicommerce.com / admin123');
  console.log('Customer : customer@geminicommerce.com / customer123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('SEED ERROR:', err);
  process.exit(1);
});