const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Address extends Model { static associate(models){ this.belongsTo(models.Customer,{foreignKey:'customerId'});} }
Address.init({ customerId:DataTypes.INTEGER,zipcode:DataTypes.STRING,street:DataTypes.STRING,number:DataTypes.STRING,complement:DataTypes.STRING,neighborhood:DataTypes.STRING,city:DataTypes.STRING,state:DataTypes.STRING },{sequelize,modelName:'Address',tableName:'addresses'});
module.exports=Address;
