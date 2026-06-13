const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getItems, getWarehouseItems, createItem, updateItem, deleteItem } = require('../controllers/itemController');

// Public — stores browse all items
router.get('/', getItems);

// Warehouse only
router.get('/mine', auth(['warehouse']), getWarehouseItems);
router.post('/', auth(['warehouse']), createItem);
router.put('/:id', auth(['warehouse']), updateItem);
router.delete('/:id', auth(['warehouse']), deleteItem);

module.exports = router;
