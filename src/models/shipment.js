const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class Shipment extends Model { static associate(models){ this.belongsTo(models.Order,{foreignKey:'orderId'});} }
Shipment.init({ orderId:DataTypes.INTEGER,provider:{type:DataTypes.STRING,defaultValue:'melhor_envio'},serviceName:DataTypes.STRING,trackingCode:DataTypes.STRING,status:DataTypes.STRING,cost:DataTypes.DECIMAL(10,2),estimatedDays:DataTypes.INTEGER,providerShipmentId:DataTypes.STRING },{sequelize,modelName:'Shipment',tableName:'shipments'});
module.exports=Shipment;
