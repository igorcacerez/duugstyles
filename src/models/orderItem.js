const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class OrderItem extends Model { static associate(models){ this.belongsTo(models.Order,{foreignKey:'orderId'}); this.belongsTo(models.ProductVariation,{foreignKey:'variationId'});} }
OrderItem.init({ orderId:DataTypes.INTEGER,variationId:DataTypes.INTEGER,productName:DataTypes.STRING,quantity:DataTypes.INTEGER,unitPrice:DataTypes.DECIMAL(10,2),totalPrice:DataTypes.DECIMAL(10,2) },{sequelize,modelName:'OrderItem',tableName:'order_items'});
module.exports=OrderItem;
