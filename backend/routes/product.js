const express = require('express')
const {getAllProducts, getProduct, getOrdersOfProduct} = require('../controllers/productController.js')

// create a router
const router = express.Router()

// add request handlers to this router

// GET /api/product
router.get('/', getAllProducts);

// GET /api/product/:id
router.get('/:id', getProduct);

// GET /api/product/:id/orders
router.get('/:id/orders', getOrdersOfProduct)

// export the router
module.exports  = router
