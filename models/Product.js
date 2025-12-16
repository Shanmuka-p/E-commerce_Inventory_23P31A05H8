const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Product = sequelize.define('Product', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  basePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false }, // Store as Decimal for money!
  status: { 
    type: DataTypes.ENUM('active', 'archived', 'draft'), 
    defaultValue: 'active' 
  }
});

module.exports = Product;