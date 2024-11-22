const Order = require('../models/Orders');
const Product = require('../models/Products');
const Customer = require('../models/Customer');
const Cart = require('../models/Carts'); // Import the Cart model
const moment = require('moment');
const {sendDeliveryEmail} = require('../utils/sendEmail'); // Import the sendEmail function

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

exports.myOrders = async (req, res) => {
  try {
      // Check if the customerId is present
      if (!req.user.customerId) {
          return res.status(404).json({ success: false, message: 'Customer not found' });
      }

      // Fetch orders for the authenticated customer
      const orders = await Order.find({ customer: req.user.customerId });

      if (orders.length === 0) {
          return res.status(404).json({ success: false, message: 'No orders found for this customer' });
      }

      res.status(200).json({
          success: true,
          orders
      });
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
          success: false,
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

exports.updateOrderStatus = async (req, res, next) => {
  const { orderId, status } = req.body;

  try {
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and status are required',
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { orderStatus: status }, 
      { new: true, runValidators: true }
    ).populate('customer', 'email firstName lastName').populate('orderItems.product');

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (status === 'Delivered') {
      const customerEmail = updatedOrder.customer.email;
      const orderItems = updatedOrder.orderItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price
      }));
      const subtotal = updatedOrder.itemsPrice;
      const grandTotal = updatedOrder.totalPrice;

      await sendDeliveryEmail(customerEmail, orderItems, subtotal, grandTotal);
    }

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

// Export to get sales data for a date range
exports.getMonthlySalesWithDateRange = async (req, res, next) => {
  const { startDate, endDate } = req.query;

  // Validate date inputs
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Start date and end date are required",
    });
  }

  try {
    // Format dates for comparison
    const start = moment(startDate).startOf('day').toDate();
    const end = moment(endDate).endOf('day').toDate();

    // Aggregate sales data by month
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Transform the result for frontend use
    const formattedData = Array.from({ length: 12 }, (_, i) => ({
      month: `${start.getFullYear()}-${(i + 1).toString().padStart(2, '0')}`,
      totalSales: 0,
      orderCount: 0,
    }));
    
    salesData.forEach((data) => {
      const monthIndex = data._id.month - 1; // 0-based index for months
      formattedData[monthIndex] = {
        month: `${data._id.year}-${data._id.month.toString().padStart(2, '0')}`,
        totalSales: data.totalSales,
        orderCount: data.orderCount,
      };
    });
    

    return res.status(200).json({
      success: true,
      salesData: formattedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
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