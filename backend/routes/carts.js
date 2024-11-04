const express = require('express');
const router = express.Router();
const { addToCart, deleteFromCart, getAllCartItems} = require('../controllers/CartController');

// Route to add an item to the cart
router.post("/cart/add", addToCart);

// Route to delete an item from the cart
router.delete("/cart/delete", deleteFromCart); // Using DELETE with request body for customerId and productId

router.get("/cart/all", getAllCartItems); // fetch all carts

module.exports = router;
