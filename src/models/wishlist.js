const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Wishlist extends Model {}
Wishlist.init({ customerId:DataTypes.INTEGER,productId:DataTypes.INTEGER },{sequelize,modelName:'Wishlist',tableName:'wishlists'});
module.exports=Wishlist;
