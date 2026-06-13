const { Order, OrderItem, Item, Store, Warehouse } = require('../models');
const sequelize = require('../config/database');

const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { warehouse_id, notes, items } = req.body;
    // items: [{ item_id, quantity_requested }]

    const order = await Order.create(
      { store_id: req.user.id, warehouse_id, notes },
      { transaction: t }
    );

    const orderItems = items.map((i) => ({
      order_id: order.id,
      item_id: i.item_id,
      quantity_requested: i.quantity_requested,
    }));
    await OrderItem.bulkCreate(orderItems, { transaction: t });

    await t.commit();
    res.status(201).json(order);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

const getStoreOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { store_id: req.user.id },
      include: [
        { model: Warehouse, attributes: ['id', 'name'] },
        { model: OrderItem, include: [{ model: Item, attributes: ['id', 'name', 'unit'] }] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWarehouseOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { warehouse_id: req.user.id },
      include: [
        { model: Store, attributes: ['id', 'name'] },
        { model: OrderItem, include: [{ model: Item, attributes: ['id', 'name', 'unit'] }] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { status } = req.body;
    const order = await Order.findOne({
      where: { id: req.params.id, warehouse_id: req.user.id },
      include: [{ model: OrderItem }],
      transaction: t,
    });

    if (!order) { await t.rollback(); return res.status(404).json({ error: 'Order not found' }); }
    if (order.status !== 'pending') { await t.rollback(); return res.status(409).json({ error: 'Order already processed' }); }

    if (status === 'accepted') {
      for (const oi of order.OrderItems) {
        const item = await Item.findByPk(oi.item_id, { transaction: t });
        if (!item || item.quantity < oi.quantity_requested) {
          await t.rollback();
          return res.status(409).json({ error: `Insufficient stock for item ${oi.item_id}` });
        }
        await item.decrement('quantity', { by: oi.quantity_requested, transaction: t });
      }
    }

    await order.update({ status }, { transaction: t });
    await t.commit();
    res.json(order);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrder, getStoreOrders, getWarehouseOrders, updateOrderStatus };
