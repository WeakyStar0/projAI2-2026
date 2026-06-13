const sequelize = require('../config/database');
const Warehouse = require('./Warehouse');
const Store = require('./Store');
const Category = require('./Category');
const Item = require('./Item');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Warehouse has many Items
Warehouse.hasMany(Item, { foreignKey: 'warehouse_id', onDelete: 'CASCADE' });
Item.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });

// Category has many Items
Category.hasMany(Item, { foreignKey: 'category_id', onDelete: 'SET NULL' });
Item.belongsTo(Category, { foreignKey: 'category_id' });

// Store has many Orders
Store.hasMany(Order, { foreignKey: 'store_id', onDelete: 'CASCADE' });
Order.belongsTo(Store, { foreignKey: 'store_id' });

// Warehouse has many Orders
Warehouse.hasMany(Order, { foreignKey: 'warehouse_id', onDelete: 'CASCADE' });
Order.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });

// Order has many OrderItems
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Item has many OrderItems
Item.hasMany(OrderItem, { foreignKey: 'item_id' });
OrderItem.belongsTo(Item, { foreignKey: 'item_id' });

module.exports = { sequelize, Warehouse, Store, Category, Item, Order, OrderItem };
