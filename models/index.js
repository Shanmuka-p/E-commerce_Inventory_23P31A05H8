// models/index.js
const { sequelize } = require('../config/database');

// Import the individual model definitions
const Product = require('./Product');
const Variant = require('./Variant');
const Category = require('./Category');
const Reservation = require('./Reservation');

// --- Define Relationships (Associations) ---

// Product <-> Variant
Product.hasMany(Variant, { foreignKey: 'ProductId' });
Variant.belongsTo(Product, { foreignKey: 'ProductId' });

// Category Hierarchy
Category.hasMany(Category, { as: 'subCategories', foreignKey: 'parentId' });
Category.belongsTo(Category, { as: 'parentCategory', foreignKey: 'parentId' });

// Product <-> Category (Optional, if you want products to have categories)
Category.hasMany(Product);
Product.belongsTo(Category);

// Variant <-> Reservation
Variant.hasMany(Reservation, { foreignKey: 'variantId' });
Reservation.belongsTo(Variant, { foreignKey: 'variantId' });

// Export everything together
module.exports = {
    sequelize,
    Product,
    Variant,
    Category,
    Reservation
};