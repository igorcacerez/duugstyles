const bcrypt = require('bcryptjs');
const asaasService = require('../services/asaasService');
const { Customer, Order, OrderItem, Payment, Shipment, Coupon } = require('../models');
const { calculateCartTotals } = require('../helpers/cartTotals');

async function resolveCustomer(req) {
  if (req.session.customer?.id) {
    const customer = await Customer.findByPk(req.session.customer.id);
    if (customer) return customer;
  }

  const email = String(req.body.email || '').trim().toLowerCase();
  let customer = await Customer.findOne({ where: { email } });
  if (customer) {
    await customer.update({
      fullName: req.body.fullName || customer.fullName,
      phone: req.body.phone || customer.phone,
      cpfCnpj: req.body.cpfCnpj || customer.cpfCnpj
    });
    return customer;
  }

  const temporaryHash = await bcrypt.hash(`guest-${Date.now()}-${email}`, 8);
  customer = await Customer.create({
    fullName: req.body.fullName,
    email,
    phone: req.body.phone,
    cpfCnpj: req.body.cpfCnpj,
    passwordHash: temporaryHash
  });
  return customer;
}

function paymentStatus(providerStatus) {
  const status = String(providerStatus || '').toUpperCase();
  if (status === 'RECEIVED' || status === 'CONFIRMED') return 'paid';
  if (status === 'CANCELLED') return 'cancelled';
  if (status === 'EXPIRED') return 'expired';
  if (status === 'REFUNDED') return 'refunded';
  if (status === 'FAILED') return 'failed';
  return 'waiting';
}

function orderStatus(status) {
  return status === 'paid' ? 'paid' : 'pending_payment';
}

module.exports = {
  page(req, res) {
    const cart = req.session.cart || [];
    if (!cart.length) return res.redirect('/carrinho');
    const totals = calculateCartTotals(cart, req.session.coupon || null);
    res.render('store/checkout', { cart, coupon: req.session.coupon || null, ...totals });
  },
  async process(req, res) {
    const cart = req.session.cart || [];
    if (!cart.length) return res.redirect('/carrinho');
    const totals = calculateCartTotals(cart, req.session.coupon || null);
    const customer = await resolveCustomer(req);
    const providerCustomer = await asaasService.createCustomer({ name: customer.fullName, email: customer.email });
    const charge = await asaasService.createCharge({ customer: providerCustomer.id, billingType: req.body.paymentMethod, value: totals.total.toFixed(2) });
    const mappedPaymentStatus = paymentStatus(charge.status);
    const order = await Order.create({
      customerId: customer.id,
      couponId: req.session.coupon?.id || null,
      number: `DUUG-${Date.now()}`,
      status: orderStatus(mappedPaymentStatus),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shippingCost: totals.shipping,
      total: totals.total
    });

    await Promise.all(cart.map((item) => OrderItem.create({
      orderId: order.id,
      variationId: item.variationId || null,
      productName: item.name,
      quantity: Number(item.quantity || 1),
      unitPrice: Number(item.price || 0),
      totalPrice: Number(item.price || 0) * Number(item.quantity || 1)
    })));

    await Payment.create({
      orderId: order.id,
      provider: 'asaas',
      method: req.body.paymentMethod,
      providerPaymentId: charge.id,
      status: mappedPaymentStatus,
      amount: totals.total
    });

    await Shipment.create({
      orderId: order.id,
      provider: 'melhor_envio',
      serviceName: req.body.shippingService || 'A calcular',
      trackingCode: null,
      status: 'aguardando_postagem',
      cost: totals.shipping,
      estimatedDays: null,
      providerShipmentId: null
    });

    if (req.session.coupon?.id) {
      await Coupon.increment('uses', { by: 1, where: { id: req.session.coupon.id } });
    }

    req.session.customer = { id: customer.id, email: customer.email, name: customer.fullName };
    req.session.lastOrder = { number: order.number, payment: charge.status, total: totals.total };
    req.session.cart = [];
    delete req.session.coupon;
    res.redirect('/checkout/sucesso');
  },
  success(req, res) {
    res.render('store/checkout-success', { order: req.session.lastOrder });
  },
  webhook(req, res) {
    res.status(200).json({ ok: true, received: req.body });
  }
};
