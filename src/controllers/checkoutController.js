const asaasService = require('../services/asaasService');

module.exports = {
  page(req, res) {
    res.render('store/checkout', { cart: req.session.cart || [] });
  },
  async process(req, res) {
    const customer = await asaasService.createCustomer({ name: req.body.fullName, email: req.body.email });
    const charge = await asaasService.createCharge({ customer: customer.id, billingType: req.body.paymentMethod, value: req.body.total });
    req.session.lastOrder = { number: `DUUG-${Date.now()}`, payment: charge.status };
    res.redirect('/checkout/sucesso');
  },
  success(req, res) {
    res.render('store/checkout-success', { order: req.session.lastOrder });
  },
  webhook(req, res) {
    res.status(200).json({ ok: true, received: req.body });
  }
};
