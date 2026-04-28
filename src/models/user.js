const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}
User.init({
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  passwordHash: DataTypes.STRING,
  role: { type: DataTypes.ENUM('admin', 'customer'), defaultValue: 'customer' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { sequelize, modelName: 'User', tableName: 'users' });

module.exports = User;
