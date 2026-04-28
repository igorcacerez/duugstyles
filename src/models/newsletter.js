const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Newsletter extends Model {}
Newsletter.init({ email:{type:DataTypes.STRING,unique:true},isActive:{type:DataTypes.BOOLEAN,defaultValue:true} },{sequelize,modelName:'Newsletter',tableName:'newsletters'});
module.exports=Newsletter;
