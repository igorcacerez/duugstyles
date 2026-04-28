const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Payment extends Model { static associate(models){ this.belongsTo(models.Order,{foreignKey:'orderId'});} }
Payment.init({ orderId:DataTypes.INTEGER,provider:{type:DataTypes.STRING,defaultValue:'asaas'},method:DataTypes.ENUM('credit_card','pix','boleto'),providerPaymentId:DataTypes.STRING,status:DataTypes.ENUM('waiting','paid','cancelled','expired','refunded','failed'),amount:DataTypes.DECIMAL(10,2) },{sequelize,modelName:'Payment',tableName:'payments'});
module.exports=Payment;
