const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
const Product = require('./Product');

const Variant = sequelize.define('Variant', {
  sku: { type: DataTypes.STRING, unique: true, allowNull: false },
  
  // Example: 'Size: L, Color: Red' (Keep it simple for now)
  attributes: { type: DataTypes.JSONB }, 

  // Price adjustment (+10.00 or -5.00 relative to basePrice)
  priceAdjustment: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },

  // TOTAL physical stock sitting in the warehouse.
  // We do NOT subtract from this when adding to cart. Only on Checkout.
  stockQuantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, {
  // Indexing is vital for performance when looking up SKUs
  indexes: [{ unique: true, fields: ['sku'] }]
});

// Relationship
Product.hasMany(Variant);
Variant.belongsTo(Product);

module.exports = Variant;