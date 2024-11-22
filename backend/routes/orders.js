const express = require('express')
const router = express.Router();


const { createOrder,
    myOrders,
    getSingleOrder,
    allOrders,
    updateOrder,
    deleteOrder,
    totalOrders,
    totalSales,
    customerSales,
    salesPerMonth,
    getAllOrders,
    updateOrderStatus,
} = require('../controllers/OrderController')

const { isAuthenticatedUser} = require('../middlewares/auth')


//customer side
router.post('/order/new', isAuthenticatedUser, createOrder);
router.get('/orders/all', isAuthenticatedUser, myOrders);
router.get('/order/:id', isAuthenticatedUser, getSingleOrder);

// Admin routes
router.get('/orderInfo', isAuthenticatedUser, getAllOrders);
// router.put('/orderInfo:id', isAuthenticatedUser, updateOrderStatus);
router.put('/updateOrderStatus', updateOrderStatus);

// //admin
// router.route('/admin/order/:id').put(isAuthenticatedUser, updateOrder).delete(isAuthenticatedUser, deleteOrder);


module.exports = router;