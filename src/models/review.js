const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Review extends Model {}
Review.init({ customerId:DataTypes.INTEGER,productId:DataTypes.INTEGER,rating:DataTypes.INTEGER,comment:DataTypes.TEXT,isApproved:{type:DataTypes.BOOLEAN,defaultValue:false} },{sequelize,modelName:'Review',tableName:'reviews'});
module.exports=Review;
