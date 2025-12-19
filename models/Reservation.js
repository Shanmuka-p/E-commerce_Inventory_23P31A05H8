const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
const Variant = require('./Variant');

const Reservation = sequelize.define('Reservation', {
  userId: { type: DataTypes.INTEGER, allowNull: true },
  cartId: { type: DataTypes.STRING, allowNull: false },

  quantity: { type: DataTypes.INTEGER, allowNull: false },

  price: { type: DataTypes.FLOAT, allowNull: false },

  expiresAt: { type: DataTypes.DATE, allowNull: false }
}, {
  indexes: [{ fields: ['expiresAt'] }]
});

Variant.hasMany(Reservation);
Reservation.belongsTo(Variant);

module.exports = Reservation;