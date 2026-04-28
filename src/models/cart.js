const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Cart extends Model { static associate(models){ this.belongsTo(models.Customer,{foreignKey:'customerId'}); this.hasMany(models.CartItem,{foreignKey:'cartId'});} }
Cart.init({ customerId:DataTypes.INTEGER,sessionId:DataTypes.STRING },{sequelize,modelName:'Cart',tableName:'carts'});
module.exports=Cart;
