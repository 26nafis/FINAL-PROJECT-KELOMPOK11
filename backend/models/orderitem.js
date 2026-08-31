const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define(
  'OrderItem',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },

    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    }
  },
  {
    tableName: 'order_items',
    timestamps: true
  }
);

module.exports = OrderItem;