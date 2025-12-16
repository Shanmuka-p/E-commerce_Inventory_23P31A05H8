const pricingService = require('../services/PricingService');

exports.calculatePrice = async (req, res) => {
  try {
    const { productId } = req.params;
    // Extract query params: ?quantity=5&tier=gold
    const quantity = parseInt(req.query.quantity) || 1;
    const userTier = req.query.tier || 'standard';

    // Call the Service (Business Logic)
    const priceData = await pricingService.calculatePrice(
      productId, 
      quantity, 
      { tier: userTier } // Context object
    );

    res.json({
      success: true,
      data: priceData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};