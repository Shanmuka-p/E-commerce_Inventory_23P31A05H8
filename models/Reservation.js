const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
const Variant = require('./Variant');

const Reservation = sequelize.define('Reservation', {
  // Who is reserving it?
  userId: { type: DataTypes.INTEGER, allowNull: true }, // Nullable for guest checkout
  cartId: { type: DataTypes.STRING, allowNull: false }, // Session ID or similar

  quantity: { type: DataTypes.INTEGER, allowNull: false },

  // When does this reservation die?
  expiresAt: { type: DataTypes.DATE, allowNull: false }
}, {
  // Index for the background job to find expired items quickly
  indexes: [{ fields: ['expiresAt'] }]
});

Variant.hasMany(Reservation);
Reservation.belongsTo(Variant);

module.exports = Reservation;