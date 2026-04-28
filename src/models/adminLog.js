const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class AdminLog extends Model {}
AdminLog.init({ userId:DataTypes.INTEGER,action:DataTypes.STRING,payload:DataTypes.JSON },{sequelize,modelName:'AdminLog',tableName:'admin_logs'});
module.exports=AdminLog;
