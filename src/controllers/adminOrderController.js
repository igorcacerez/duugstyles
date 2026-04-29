const { Order, OrderItem, Payment, Shipment, Customer } = require('../models');

const include = [
  Customer,
  { model: OrderItem, required: false },
  { model: Payment, required: false },
  { model: Shipment, required: false }
];

module.exports = {
  async list(req, res) {
    const orders = await Order.findAll({ include, order: [['createdAt', 'DESC']] });
    res.render('admin/orders/index', { orders });
  },
  async detail(req, res) {
    const order = await Order.findByPk(req.params.id, { include });
    if (!order) return res.redirect('/admin/pedidos');
    res.render('admin/orders/detail', { order });
  },
  async updateStatus(req, res) {
    const order = await Order.findByPk(req.params.id, { include: [Payment, Shipment] });
    if (!order) return res.redirect('/admin/pedidos');
    await order.update({ status: req.body.status });
    if (order.Payment && req.body.paymentStatus) await order.Payment.update({ status: req.body.paymentStatus });
    if (order.Shipment && req.body.shipmentStatus) await order.Shipment.update({ status: req.body.shipmentStatus, trackingCode: req.body.trackingCode || order.Shipment.trackingCode });
    res.redirect(`/admin/pedidos/${order.id}`);
  }
};
