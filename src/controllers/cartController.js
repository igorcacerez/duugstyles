const melhorEnvioService = require('../services/melhorEnvioService');

module.exports = {
  view(req, res) {
    const cart = req.session.cart || [];
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.render('store/cart', { cart, subtotal, shippingOptions: [], total: subtotal });
  },
  add(req, res) {
    const cart = req.session.cart || [];
    cart.push({ ...req.body, quantity: Number(req.body.quantity || 1), price: Number(req.body.price || 0) });
    req.session.cart = cart;
    res.redirect('/carrinho');
  },
  remove(req, res) {
    const cart = req.session.cart || [];
    req.session.cart = cart.filter((_, index) => index !== Number(req.params.index));
    res.redirect('/carrinho');
  },
  async freight(req, res) {
    const options = await melhorEnvioService.calculateShipping({ zipcode: req.body.zipcode });
    const cart = req.session.cart || [];
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.render('store/cart', { cart, subtotal, shippingOptions: options, total: subtotal });
  }
};
