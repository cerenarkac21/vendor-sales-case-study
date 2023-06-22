const express = require('express')
const { getAllOrders, getOrder, getOrdersByYear, getOrdersByTime, getOrdersByTimeAndProduct} = require('../controllers/orderController.js');
// create a router
const router = express.Router()

// add request handlers to this router

// GET /api/order
router.get('/', getAllOrders);

// GET /api/order/:id
router.get('/:id', getOrder);

// GET api/order/time/:year
router.get('/year/:year', getOrdersByYear);

// GET api/order/year/:year/month/:month
router.get('/year/:year/month/:month', getOrdersByTime);

// GET api/order/year/:year/month/:month
router.get('/year/:year/month/:month/product/:product', getOrdersByTimeAndProduct);

// export the router
module.exports  = router
