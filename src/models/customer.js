const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Customer extends Model { static associate(models){ this.hasMany(models.Address,{foreignKey:'customerId'}); this.hasMany(models.Order,{foreignKey:'customerId'});} }
Customer.init({ fullName:DataTypes.STRING,email:{type:DataTypes.STRING,unique:true},cpfCnpj:DataTypes.STRING,phone:DataTypes.STRING,passwordHash:DataTypes.STRING,isBlocked:{type:DataTypes.BOOLEAN,defaultValue:false} },{sequelize,modelName:'Customer',tableName:'customers'});
module.exports=Customer;
