const { Customer, Order, OrderItem, Payment, Shipment } = require('../models');
const seoService = require('../services/seoService');

const orderInclude = [
  { model: OrderItem, required: false },
  { model: Payment, required: false },
  { model: Shipment, required: false }
];

module.exports = {
  async account(req, res) {
    const customer = await Customer.findByPk(req.session.customer.id);
    const orders = await Order.findAll({
      where: { customerId: customer.id },
      include: orderInclude,
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    res.render('customer/account', {
      customer,
      orders,
      meta: seoService.buildMeta({ title: 'Minha conta | Duug Styles', description: 'Acompanhe pedidos e dados da sua conta Duug Styles.' })
    });
  },

  async orders(req, res) {
    const orders = await Order.findAll({
      where: { customerId: req.session.customer.id },
      include: orderInclude,
      order: [['createdAt', 'DESC']]
    });
    res.render('customer/orders', {
      orders,
      meta: seoService.buildMeta({ title: 'Meus pedidos | Duug Styles' })
    });
  },

  async order(req, res) {
    const order = await Order.findOne({
      where: { customerId: req.session.customer.id, number: req.params.number },
      include: orderInclude
    });
    if (!order) return res.status(404).render('errors/404', { meta: seoService.buildMeta({ title: 'Pedido nao encontrado' }) });
    res.render('customer/order-detail', {
      order,
      meta: seoService.buildMeta({ title: `Pedido ${order.number} | Duug Styles` })
    });
  }
};
