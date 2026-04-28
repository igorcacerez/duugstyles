const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class ProductVariation extends Model { static associate(models){ this.belongsTo(models.Product,{foreignKey:'productId'}); this.belongsTo(models.Size,{foreignKey:'sizeId'}); this.belongsTo(models.Color,{foreignKey:'colorId'});} }
ProductVariation.init({ productId:DataTypes.INTEGER,sizeId:DataTypes.INTEGER,colorId:DataTypes.INTEGER,sku:{type:DataTypes.STRING,unique:true},price:DataTypes.DECIMAL(10,2),stock:{type:DataTypes.INTEGER,defaultValue:0} },{sequelize,modelName:'ProductVariation',tableName:'product_variations'});
module.exports=ProductVariation;
