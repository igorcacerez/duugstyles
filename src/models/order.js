const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Order extends Model { static associate(models){ this.belongsTo(models.Customer,{foreignKey:'customerId'}); this.hasMany(models.OrderItem,{foreignKey:'orderId'}); this.hasOne(models.Payment,{foreignKey:'orderId'}); this.hasOne(models.Shipment,{foreignKey:'orderId'}); this.belongsTo(models.Coupon,{foreignKey:'couponId'});} }
Order.init({ customerId:DataTypes.INTEGER,couponId:DataTypes.INTEGER,number:{type:DataTypes.STRING,unique:true},status:{type:DataTypes.ENUM('pending_payment','paid','picking','shipped','delivered','cancelled','refunded'),defaultValue:'pending_payment'},subtotal:DataTypes.DECIMAL(10,2),discount:DataTypes.DECIMAL(10,2),shippingCost:DataTypes.DECIMAL(10,2),total:DataTypes.DECIMAL(10,2) },{sequelize,modelName:'Order',tableName:'orders'});
module.exports=Order;
