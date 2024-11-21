const Order = require('../models/Orders');
const Product = require('../models/Products');
const Customer = require('../models/Customer');
const Cart = require('../models/Carts'); // Import the Cart model

exports.createOrder = async (req, res, next) => {
    // Fetch associated Customer record
    const customer = await Customer.findOne({ user: req.user._id });

    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        customer
    });

    // Delete the cart items after successfully creating the order
    try {
        await Cart.deleteMany({ customerId: customer._id });
        console.log("Cart items deleted successfully");
    } catch (error) {
        console.error("Error deleting cart items:", error.message);
    }

    return res.status(200).json({
        success: true,
        order
    });
};

exports.myOrders = async (req, res, next) => {
    try {
      const orders = await Order.find({ customer: req.user.customerId }).populate('orderItems.product');
      if (!orders) {
        return res.status(400).json({ message: 'Error loading orders' });
      }
      return res.status(200).json({
        success: true,
        orders
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
  };
  
exports.getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('customer', 'firstName lastName');
    if (!order) {
        return res.status(404).json({
            message: 'No Order found with this ID',
        });
    }
    return res.status(200).json({
        success: true,
        order
    });
};