const { Customer, Order } = require('../models');

module.exports = {
  async list(req, res) {
    const customers = await Customer.findAll({ include: [{ model: Order, required: false }], order: [['createdAt', 'DESC']] });
    res.render('admin/customers/index', { customers });
  },
  async detail(req, res) {
    const customer = await Customer.findByPk(req.params.id, { include: [{ model: Order, required: false }] });
    if (!customer) return res.redirect('/admin/clientes');
    res.render('admin/customers/detail', { customer });
  },
  async toggleBlock(req, res) {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) await customer.update({ isBlocked: !customer.isBlocked });
    res.redirect(`/admin/clientes/${req.params.id}`);
  }
};
