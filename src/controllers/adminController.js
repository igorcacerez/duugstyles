const { Op } = require('sequelize');
const { Product, Order, Customer, Coupon, Banner } = require('../models');

module.exports = {
  async dashboard(req, res) {
    const [products, orders, customers, coupons, banners, recentOrders] = await Promise.all([
      Product.count(),
      Order.count(),
      Customer.count(),
      Coupon.count(),
      Banner.count(),
      Order.findAll({ include: [Customer], order: [['createdAt', 'DESC']], limit: 6 })
    ]);
    const paidRevenue = await Order.sum('total', { where: { status: { [Op.in]: ['paid', 'picking', 'shipped', 'delivered'] } } });
    res.render('admin/dashboard', { stats: { products, orders, customers, coupons, banners, revenue: Number(paidRevenue || 0) }, recentOrders });
  }
};
