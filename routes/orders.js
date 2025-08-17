const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController');

// getAllOrders for a user
// add item in the cart
// update product quantity in cart
// getCart
// move cart ->  status update to placed

// Add Item to the cart
router.post('/add-to-cart', orderController.addItemToCart);

// Get all orders for a user
router.get('/get' , orderController.getAllOrders);

// Get a specific order by ID
router.get('/get/:orderId' , orderController.getOrderById);

// Get the cart for a user
router.get('/cart' , orderController.getCart);

// Place a new order from the cart
router.post('/placeorder', orderController.placeOrder);

// Update the quantity of a product in the cart
router.post('/updatecart' , orderController.updateCart);

// Move an item from the cart to the wishlist
router.post('/moveToWishlist' , orderController.moveToWishlist);

module.exports = router;

// p -> 5
// deleteAPI -> delete the Product
// updateCart -> {qty , -5}