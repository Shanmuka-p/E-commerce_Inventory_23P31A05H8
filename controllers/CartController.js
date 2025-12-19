const inventoryService = require('../services/InventoryService');

exports.addToCart = async (req, res) => {
  try {
    const { variantId, quantity, userId } = req.body;

    if (!variantId || !quantity) {
      return res.status(400).json({ error: 'Missing variantId or quantity' });
    }

    const result = await inventoryService.reserveStock(variantId, quantity, userId);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(409).json(result); 
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const { userId } = req.body;

    const result = await inventoryService.checkout(userId);

    res.json(result);

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};