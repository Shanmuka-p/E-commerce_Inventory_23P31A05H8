const { Product, Variant } = require('../models');

class PricingService {

  async calculatePrice(variantId, quantity, userContext = {}) {
    const variant = await Variant.findByPk(variantId, {
      include: [Product]
    });

    if (!variant) throw new Error('Variant not found');

    let basePrice = parseFloat(variant.Product.basePrice); 
    let adjustment = parseFloat(variant.priceAdjustment);
    let unitPrice = basePrice + adjustment;

    let breakdown = [
      { rule: 'Base Price', amount: unitPrice }
    ];

    const isSeasonSale = true; 
    if (isSeasonSale) {
      const discount = unitPrice * 0.10;
      unitPrice -= discount;
      breakdown.push({ rule: 'Seasonal Discount (10%)', amount: -discount.toFixed(2) });
    }

    if (quantity > 10) {
      const discount = unitPrice * 0.05;
      unitPrice -= discount;
      breakdown.push({ rule: 'Bulk Discount (5%)', amount: -discount.toFixed(2) });
    }

    if (userContext.tier === 'gold') {
      const discount = unitPrice * 0.15;
      unitPrice -= discount;
      breakdown.push({ rule: 'Gold Tier Discount (15%)', amount: -discount.toFixed(2) });
    }

    const finalTotal = unitPrice * quantity;

    return {
      originalPrice: (basePrice + adjustment).toFixed(2),
      finalUnitPrice: unitPrice.toFixed(2),
      finalTotal: finalTotal.toFixed(2),
      breakdown
    };
  }
}

module.exports = new PricingService();