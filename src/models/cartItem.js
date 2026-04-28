const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class CartItem extends Model { static associate(models){ this.belongsTo(models.Cart,{foreignKey:'cartId'}); this.belongsTo(models.ProductVariation,{foreignKey:'variationId'});} }
CartItem.init({ cartId:DataTypes.INTEGER,variationId:DataTypes.INTEGER,quantity:{type:DataTypes.INTEGER,defaultValue:1},unitPrice:DataTypes.DECIMAL(10,2) },{sequelize,modelName:'CartItem',tableName:'cart_items'});
module.exports=CartItem;
