const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PricingRule = sequelize.define('PricingRule', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('bulk', 'user_specific', 'seasonal'),
    allowNull: false,
  },
  discount_percentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  min_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user_tier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  starts_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ends_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = PricingRule;
