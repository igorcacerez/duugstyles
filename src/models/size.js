const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Size extends Model {}
Size.init({ name:DataTypes.STRING,isActive:{type:DataTypes.BOOLEAN,defaultValue:true} },{sequelize,modelName:'Size',tableName:'sizes'});
module.exports=Size;
