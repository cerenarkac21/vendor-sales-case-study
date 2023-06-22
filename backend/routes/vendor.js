const express = require('express')
const { getVendor, getAllVendors, getProductsWithVendorId } = require('../controllers/vendorController');

// create a router
const router = express.Router()

// add request handlers to this router

// GET /api/vendor
router.get('/', getAllVendors);

// GET /api/vendor/:id
router.get('/:id', getVendor);

// GET /api/vendor/:id/products
router.get('/:id/products', getProductsWithVendorId)


// export the router
module.exports  = router
