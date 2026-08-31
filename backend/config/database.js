const { Sequelize } = require('sequelize');
const config = require('./env');

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL belum diisi di file .env');
}

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions:
    process.env.NODE_ENV === 'production'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {}
});

module.exports = sequelize;