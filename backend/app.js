require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

app.use(cors({
  origin: (origin, cb) => cb(null, true),
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/warehouses', require('./routes/warehouses'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;

const DEFAULT_CATEGORIES = [
  'Wood', 'Metal', 'Plastics', 'Electronics', 'Chemicals',
  'Textiles', 'Paper', 'Glass', 'Rubber', 'Food & Beverage',
];

sequelize.sync({ alter: true }).then(async () => {
  const { Category } = require('./models');
  const count = await Category.count();
  if (count === 0) {
    await Category.bulkCreate(DEFAULT_CATEGORIES.map((name) => ({ name })));
    console.log('Default categories seeded');
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('DB connection failed:', err);
  process.exit(1);
});
