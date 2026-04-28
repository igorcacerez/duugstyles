const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Color extends Model {}
Color.init({ name:DataTypes.STRING,hexCode:DataTypes.STRING,isActive:{type:DataTypes.BOOLEAN,defaultValue:true} },{sequelize,modelName:'Color',tableName:'colors'});
module.exports=Color;
