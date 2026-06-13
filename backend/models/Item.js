const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  unit: { type: DataTypes.STRING, defaultValue: 'units' },
  warehouse_id: { type: DataTypes.INTEGER, allowNull: false },
  category_id: { type: DataTypes.INTEGER },
}, { tableName: 'items', timestamps: true });

module.exports = Item;
