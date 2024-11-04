const express = require('express');
const router = express.Router();
const { addToCart, deleteFromCart } = require('../controllers/CartController');

// Route to add an item to the cart
router.post("/add", addToCart);

// Route to delete an item from the cart
router.delete("/delete", deleteFromCart); // Using DELETE with request body for customerId and productId

module.exports = router;
