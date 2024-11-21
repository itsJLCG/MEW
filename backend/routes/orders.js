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
} = require('../controllers/OrderController')

const { isAuthenticatedUser } = require('../middlewares/auth')


//customer side
router.post('/order/new', isAuthenticatedUser, createOrder);
router.get('/orders/all', isAuthenticatedUser, myOrders);
router.get('/order/:id', isAuthenticatedUser, getSingleOrder);

// //admin
// router.route('/admin/order/:id').put(isAuthenticatedUser, updateOrder).delete(isAuthenticatedUser, deleteOrder);


module.exports = router;