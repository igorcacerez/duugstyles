const asaasService = require('../services/asaasService');
const { calculateCartTotals } = require('../helpers/cartTotals');

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
    const customer = await asaasService.createCustomer({ name: req.body.fullName, email: req.body.email });
    const charge = await asaasService.createCharge({ customer: customer.id, billingType: req.body.paymentMethod, value: totals.total.toFixed(2) });
    req.session.lastOrder = { number: `DUUG-${Date.now()}`, payment: charge.status, total: totals.total };
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
