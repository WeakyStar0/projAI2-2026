const express = require('express');
const router = express.Router();
const { Warehouse } = require('../models');

router.get('/', async (req, res) => {
  try {
    const warehouses = await Warehouse.findAll({
      attributes: ['id', 'name', 'location'],
      order: [['name', 'ASC']],
    });
    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
