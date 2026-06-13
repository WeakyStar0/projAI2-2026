const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Warehouse, Store } = require('../models');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const registerWarehouse = async (req, res) => {
  try {
    const { name, location, email, password } = req.body;
    const existing = await Warehouse.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const warehouse = await Warehouse.create({ name, location, email, password_hash });
    const token = signToken(warehouse.id, 'warehouse');
    res.status(201).json({ token, user: { id: warehouse.id, name: warehouse.name, role: 'warehouse' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginWarehouse = async (req, res) => {
  try {
    const { email, password } = req.body;
    const warehouse = await Warehouse.findOne({ where: { email } });
    if (!warehouse) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, warehouse.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(warehouse.id, 'warehouse');
    res.json({ token, user: { id: warehouse.id, name: warehouse.name, role: 'warehouse' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registerStore = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Store.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const store = await Store.create({ name, email, password_hash });
    const token = signToken(store.id, 'store');
    res.status(201).json({ token, user: { id: store.id, name: store.name, role: 'store' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginStore = async (req, res) => {
  try {
    const { email, password } = req.body;
    const store = await Store.findOne({ where: { email } });
    if (!store) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, store.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(store.id, 'store');
    res.json({ token, user: { id: store.id, name: store.name, role: 'store' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerWarehouse, loginWarehouse, registerStore, loginStore };
