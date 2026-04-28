const sequelize = require('../config/database');

const User = require('./user');
const Customer = require('./customer');
const Address = require('./address');
const Category = require('./category');
const Product = require('./product');
const ProductImage = require('./productImage');
const Size = require('./size');
const Color = require('./color');
const ProductVariation = require('./productVariation');
const Cart = require('./cart');
const CartItem = require('./cartItem');
const Order = require('./order');
const OrderItem = require('./orderItem');
const Payment = require('./payment');
const Shipment = require('./shipment');
const Coupon = require('./coupon');
const Banner = require('./banner');
const Setting = require('./setting');
const Review = require('./review');
const Wishlist = require('./wishlist');
const Newsletter = require('./newsletter');
const AdminLog = require('./adminLog');

const models = { User, Customer, Address, Category, Product, ProductImage, Size, Color, ProductVariation, Cart, CartItem, Order, OrderItem, Payment, Shipment, Coupon, Banner, Setting, Review, Wishlist, Newsletter, AdminLog };

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') model.associate(models);
});

module.exports = { sequelize, ...models };
