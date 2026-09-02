const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false
    },

    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    aiGenerated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'products',
    timestamps: true
  }
);

module.exports = Product;