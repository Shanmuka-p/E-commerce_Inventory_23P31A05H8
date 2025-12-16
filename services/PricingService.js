const { Product, Variant } = require('../models');

class PricingService {

  /**
   * Calculates the final price for a specific cart item.
   * @param {string} variantId 
   * @param {number} quantity 
   * @param {Object} userContext (e.g., { tier: 'gold' })
   */
  async calculatePrice(variantId, quantity, userContext = {}) {
    // 1. Fetch Data
    const variant = await Variant.findByPk(variantId, {
      include: [Product]
    });

    if (!variant) throw new Error('Variant not found');

    // 2. Base Price Calculation
    // ParseFloat is needed because SQL returns decimals as strings to preserve precision
    let basePrice = parseFloat(variant.Product.basePrice); 
    let adjustment = parseFloat(variant.priceAdjustment);
    let unitPrice = basePrice + adjustment;

    // We keep a log of what discounts were applied to show the user later
    let breakdown = [
      { rule: 'Base Price', amount: unitPrice }
    ];

    // --- RULE 1: SEASONAL (e.g., "Summer Sale" - 10% off) ---
    // In a real app, you would fetch active rules from DB. 
    // Here we simulate a hardcoded active rule.
    const isSeasonSale = true; // Toggle this to test
    if (isSeasonSale) {
      const discount = unitPrice * 0.10; // 10%
      unitPrice -= discount;
      breakdown.push({ rule: 'Seasonal Discount (10%)', amount: -discount.toFixed(2) });
    }

    // --- RULE 2: BULK DISCOUNT (Buy > 10, get 5% off) ---
    if (quantity > 10) {
      const discount = unitPrice * 0.05;
      unitPrice -= discount;
      breakdown.push({ rule: 'Bulk Discount (5%)', amount: -discount.toFixed(2) });
    }

    // --- RULE 3: USER TIER (Gold users get extra 15% off) ---
    if (userContext.tier === 'gold') {
      const discount = unitPrice * 0.15;
      unitPrice -= discount;
      breakdown.push({ rule: 'Gold Tier Discount (15%)', amount: -discount.toFixed(2) });
    }

    // Final Total
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