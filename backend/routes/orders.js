const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createOrder, getStoreOrders, getWarehouseOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/', auth(['store']), createOrder);
router.get('/store', auth(['store']), getStoreOrders);
router.get('/warehouse', auth(['warehouse']), getWarehouseOrders);
router.patch('/:id/status', auth(['warehouse']), updateOrderStatus);

module.exports = router;
