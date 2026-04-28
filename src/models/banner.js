const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Banner extends Model {}
Banner.init({ title:DataTypes.STRING,subtitle:DataTypes.STRING,imageUrl:DataTypes.STRING,link:DataTypes.STRING,position:DataTypes.STRING,sortOrder:{type:DataTypes.INTEGER,defaultValue:0},isActive:{type:DataTypes.BOOLEAN,defaultValue:true} },{sequelize,modelName:'Banner',tableName:'banners'});
module.exports=Banner;
