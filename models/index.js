const { sequelize } = require('../config/database');

const Product = require('./Product');
const Variant = require('./Variant');
const Category = require('./Category');
const Reservation = require('./Reservation');
const PricingRule = require('./PricingRule');

Product.hasMany(Variant, { foreignKey: 'ProductId' });
Variant.belongsTo(Product, { foreignKey: 'ProductId' });

Category.hasMany(Category, { as: 'subCategories', foreignKey: 'parentId' });
Category.belongsTo(Category, { as: 'parentCategory', foreignKey: 'parentId' });

Category.hasMany(Product);
Product.belongsTo(Category);

Variant.hasMany(Reservation, { foreignKey: 'variantId' });
Reservation.belongsTo(Variant, { foreignKey: 'variantId' });

Product.hasMany(PricingRule, { foreignKey: 'productId' });
PricingRule.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
    sequelize,
    Product,
    Variant,
    Category,
    Reservation,
    PricingRule
};