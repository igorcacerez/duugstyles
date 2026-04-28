const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class ProductImage extends Model { static associate(models){ this.belongsTo(models.Product,{foreignKey:'productId'});} }
ProductImage.init({ productId:DataTypes.INTEGER,imageUrl:DataTypes.STRING,altText:DataTypes.STRING,isMain:{type:DataTypes.BOOLEAN,defaultValue:false} },{sequelize,modelName:'ProductImage',tableName:'product_images'});
module.exports=ProductImage;
