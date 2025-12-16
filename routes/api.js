const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/ProductController');
const CartController = require('../controllers/CartController');

// --- Product Routes ---
// GET /api/products/1/price?quantity=5&tier=gold
router.get('/products/:productId/price', ProductController.calculatePrice);

// --- Cart Routes ---
// POST /api/cart/add  (Body: { variantId, quantity, userId })
router.post('/cart/add', CartController.addToCart);

// POST /api/cart/checkout (Body: { userId })
router.post('/cart/checkout', CartController.checkout);

module.exports = router;