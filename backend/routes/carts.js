const express = require('express');
const router = express.Router();
const { addToCart, deleteFromCart, getAllCartItems, getCartByCustomerId, getCart} = require('../controllers/CartController');
const { isAuthenticatedUser } = require("../middlewares/auth");
// const { isAuthenticatedUser} = require('../middlewares/auth');

// Route to add an item to the cart
router.post("/cart/add",isAuthenticatedUser, addToCart);

// Route to delete an item from the cart
router.delete("/cart/delete",isAuthenticatedUser, deleteFromCart); // Using DELETE with request body for customerId and productId

router.get("/cart/all", isAuthenticatedUser, getAllCartItems); // fetch all carts
// router.get('/cart/:customerId',getCartByCustomerId);

// router.get("/cart", isAuthenticatedUser, getCart); // fetch all carts

module.exports = router;
