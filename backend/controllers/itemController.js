const { Item, Warehouse, Category } = require('../models');
const { Op } = require('sequelize');

const getItems = async (req, res) => {
  try {
    const { search, category_id, min_quantity } = req.query;
    const where = {};

    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (category_id) where.category_id = category_id;
    if (min_quantity) where.quantity = { [Op.gte]: parseInt(min_quantity) };
    if (req.query.warehouse_id) where.warehouse_id = req.query.warehouse_id;

    const items = await Item.findAll({
      where,
      include: [
        { model: Warehouse, attributes: ['id', 'name', 'location'] },
        { model: Category, attributes: ['id', 'name'] },
      ],
      order: [['name', 'ASC']],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWarehouseItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { warehouse_id: req.user.id },
      include: [{ model: Category, attributes: ['id', 'name'] }],
      order: [['name', 'ASC']],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createItem = async (req, res) => {
  try {
    const { name, description, quantity, unit, category_id } = req.body;
    const item = await Item.create({
      name, description, quantity, unit, category_id,
      warehouse_id: req.user.id,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findOne({ where: { id: req.params.id, warehouse_id: req.user.id } });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOne({ where: { id: req.params.id, warehouse_id: req.user.id } });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await item.destroy();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getItems, getWarehouseItems, createItem, updateItem, deleteItem };
