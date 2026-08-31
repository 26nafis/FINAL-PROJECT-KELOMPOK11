const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    invoiceNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    total: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },

    status: {
      type: DataTypes.ENUM(
        'pending',
        'processing',
        'shipped',
        'completed',
        'cancelled'
      ),
      defaultValue: 'pending'
    }
  },
  {
    tableName: 'orders',
    timestamps: true
  }
);

module.exports = Order;