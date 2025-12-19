const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/ProductController');
const CartController = require('../controllers/CartController');
const CategoryController = require('../controllers/CategoryController');
const VariantController = require('../controllers/VariantController');

router.post('/products', ProductController.createProduct);
router.get('/products', ProductController.getAllProducts);
router.get('/products/:id', ProductController.getProductById);
router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);

router.get('/products/:productId/price', ProductController.calculatePrice);

router.post('/categories', CategoryController.createCategory);
router.get('/categories', CategoryController.getAllCategories);
router.get('/categories/:id', CategoryController.getCategoryById);
router.put('/categories/:id', CategoryController.updateCategory);
router.delete('/categories/:id', CategoryController.deleteCategory);

router.post('/variants', VariantController.createVariant);
router.get('/variants', VariantController.getAllVariants);
router.get('/variants/:id', VariantController.getVariantById);
router.put('/variants/:id', VariantController.updateVariant);
router.delete('/variants/:id', VariantController.deleteVariant);

router.post('/cart/add', CartController.addToCart);

router.post('/cart/checkout', CartController.checkout);

module.exports = router;