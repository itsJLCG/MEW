const Cart = require("../models/Carts");


// Add an item to the cart
exports.addToCart = async (req, res) => {
  const { customerId, productId, quantity } = req.body;

  try {
    // Check if the item already exists in the cart for the customer
    let cartItem = await Cart.findOne({ customerId, productId });

    if (cartItem) {
      // If item exists, update the quantity
      cartItem.quantity += quantity;
      await cartItem.save();
      return res.status(200).json({ success: true, cartItem });
    }

    // Create a new cart item
    cartItem = new Cart({ customerId, productId, quantity });
    await cartItem.save();
    res.status(201).json({ success: true, cartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding item to cart", error });
  }
};

// Delete an item from the cart
exports.deleteFromCart = async (req, res) => {
  const { customerId, productId } = req.body;

  try {
    // Find the cart item and remove it
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
exports.getAllCartItems = async (req, res) => {
  try {
    // Find all items in the cart collection
    const cartItems = await Cart.find();

    if (cartItems.length === 0) {
      return res.status(404).json({ success: false, message: "No items found in cart" });
    }

    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching cart items", error });
  }
};
