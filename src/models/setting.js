const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Setting extends Model {}
Setting.init({ key:{type:DataTypes.STRING,unique:true},value:DataTypes.TEXT },{sequelize,modelName:'Setting',tableName:'settings'});
module.exports=Setting;
