const { Product, Order, Customer } = require('../models');

module.exports = {
  async dashboard(req, res) {
    const [products, orders, customers] = await Promise.all([Product.count(), Order.count(), Customer.count()]);
    res.render('admin/dashboard', { stats: { products, orders, customers } });
  }
};
