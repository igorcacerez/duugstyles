const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Coupon extends Model {}
Coupon.init({ code:{type:DataTypes.STRING,unique:true},type:DataTypes.ENUM('fixed','percent'),value:DataTypes.DECIMAL(10,2),startsAt:DataTypes.DATE,expiresAt:DataTypes.DATE,maxUses:DataTypes.INTEGER,uses:{type:DataTypes.INTEGER,defaultValue:0},minOrderValue:DataTypes.DECIMAL(10,2),isActive:{type:DataTypes.BOOLEAN,defaultValue:true} },{sequelize,modelName:'Coupon',tableName:'coupons'});
module.exports=Coupon;
