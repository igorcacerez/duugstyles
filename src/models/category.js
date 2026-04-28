const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Category extends Model { static associate(models){ this.hasMany(models.Product,{foreignKey:'categoryId'});} }
Category.init({ name:DataTypes.STRING,slug:{type:DataTypes.STRING,unique:true},seoText:DataTypes.TEXT,metaTitle:DataTypes.STRING,metaDescription:DataTypes.STRING,isActive:{type:DataTypes.BOOLEAN,defaultValue:true} },{sequelize,modelName:'Category',tableName:'categories'});
module.exports=Category;
