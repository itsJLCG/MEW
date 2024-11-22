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

// Export to get all orders
exports.getAllOrders = async (req, res, next) => {
  try {
      const orders = await Order.find().populate('customer', 'firstName lastName').populate('orderItems.product');
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

// Export to update order status
exports.updateOrderStatus = async (req, res, next) => {
  const { orderId, status } = req.body;

  try {
    // Check if the order ID and status are provided
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and status are required',
      });
    }

    // Find the order by ID and update the orderStatus field
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { orderStatus: status }, 
      { new: true, runValidators: true }
    );

    // If the order wasn't found
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Return the updated order
    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};



// //admin side

// exports.allOrders = async (req, res, next) => {
//   const orders = await Order.find()
//   // console.log(orders)

//   if (!orders) {
//       return res.status(404).json({
//           message: 'No Orders',

//       })
//   }
//   let totalAmount = 0;

//   orders.forEach(order => {
//       totalAmount += order.totalPrice
//   })

//   return res.status(200).json({
//       success: true,
//       totalAmount,
//       orders
//   })
// }

// exports.updateOrder = async (req, res, next) => {
//   const order = await Order.findById(req.params.id)
//   console.log(req.body.order)
//   if (!order) {
//       return res.status(404).json({
//           message: 'No Order found',

//       })
//   }
//   if (order.orderStatus === 'Delivered') {
//       return res.status(400).json({
//           message: 'You have already delivered this order',

//       })
//   }

//   order.orderItems.forEach(async item => {
//       await updateStock(item.product, item.quantity)
//   })

//   order.orderStatus = req.body.status
//   order.deliveredAt = Date.now()
//   await order.save()
//   return res.status(200).json({
//       success: true,
//   })
// }

// exports.deleteOrder = async (req, res, next) => {
//   const order = await Order.findByIdAndDelete(req.params.id)

//   if (!order) {
//       return res.status(400).json({
//           message: 'No Order found with this ID',

//       })
//       // return next(new ErrorHandler('No Order found with this ID', 404))
//   }
//   return res.status(200).json({
//       success: true
//   })
// };