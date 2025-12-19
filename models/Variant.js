const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
const Product = require('./Product');

const Variant = sequelize.define('Variant', {
  sku: { type: DataTypes.STRING, unique: true, allowNull: false },
  
  attributes: { type: DataTypes.JSONB }, 

  priceAdjustment: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },

  stockQuantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, {
  indexes: [{ unique: true, fields: ['sku'] }]
});

Product.hasMany(Variant);
Variant.belongsTo(Product);

module.exports = Variant;