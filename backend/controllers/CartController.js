const Cart = require("../models/Carts");

// Add an item to the cart
exports.addToCart = async (req, res) => {
  const { productId } = req.body;
  const quantity = req.body.quantity || 1; // Default to 1 if quantity is not provided
  const customerId = req.user.customerId; // Fetch customerId linked to user ID

  // Validate required fields
  if (!productId) {
    return res.status(400).json({ success: false, message: "Product ID is required" });
  }

  try {
    // Check if the item already exists in the cart for the customer
    let cartItem = await Cart.findOne({ customerId, productId });

    if (cartItem) {
      // If item exists, increment the quantity
      cartItem.quantity += quantity;
      await cartItem.save();
      return res.status(200).json({ success: true, message: "Item quantity updated in cart", cartItem });
    }

    // Create a new cart item if product doesn't exist in cart
    cartItem = new Cart({ customerId, productId, quantity });
    await cartItem.save();
    return res.status(201).json({ success: true, message: "Item added to cart", cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ success: false, message: "Failed to add item to cart." });
  }
};


// Delete an item from the cart
exports.deleteFromCart = async (req, res) => {
  const { productId } = req.body; // Only productId is needed in the request body
  const customerId = req.user.customerId; // Use authenticated customer's ID

  try {
    // Find the cart item and remove it based on authenticated customer's ID
    const deletedItem = await Cart.findOneAndDelete({ customerId, productId });

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    res.status(200).json({ success: true, message: "Item deleted from cart", deletedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting item from cart", error });
  }
};


// Fetch all items in the cart collection
// Fetch all items in the cart for the authenticated user
exports.getAllCartItems = async (req, res) => {
  const customerId = req.user.customerId;  // Fetch customerId from authenticated user

  try {
    // Find all cart items associated with the customerId
    const cartItems = await Cart.find({ customerId })
      .populate({
        path: 'productId', // Select specific fields from Product
        select: 'name description price stock image category brand', 
        populate: [
          {path : 'category', select: 'name'},
          {path: 'brand', select: 'name'}
        ]
      });

    if (cartItems.length === 0) {
      return res.status(200).json({ success: true, message: "No items found in cart", cartItems: [] });
    }

    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching cart items", error: error.message });
  }
};


// Update an item's quantity in the cart
exports.updateCartItemQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const customerId = req.user.customerId;

  // Validate required fields
  if (!productId || quantity === undefined) {
    return res.status(400).json({ success: false, message: "Product ID and quantity are required" });
  }

  try {
    // Find the cart item for the given customer and product
    const cartItem = await Cart.findOne({ customerId, productId });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    // Update the item's quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ success: true, message: "Item quantity updated", cartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating item quantity", error: error.message });
  }
};


// Get all cart items for a specific customer
exports.getCartByCustomerId = async (req, res) => {
  const { customerId } = req.params;

  try {
    const cartItems = await Cart.find({ customerId }).populate('productId');

    // Return success with empty list if no items are found
    return res.status(200).json({
      success: true,
      cartItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart items for customer",
      error: error.message
    });
  }
};
