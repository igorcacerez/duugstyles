const { Op, col } = require('sequelize');
const { Coupon } = require('../models');
const { calculateCartTotals } = require('../helpers/cartTotals');
const melhorEnvioService = require('../services/melhorEnvioService');

function normalizeCoupon(coupon) {
  if (!coupon) return null;
  return {
    id: coupon.id || null,
    code: String(coupon.code || '').toUpperCase(),
    type: coupon.type,
    value: Number(coupon.value || 0),
    label: coupon.label || null
  };
}

async function findCoupon(code, subtotal) {
  const normalizedCode = String(code || '').trim().toUpperCase();
  if (!normalizedCode) return { coupon: null, message: 'Informe um cupom valido.' };

  const now = new Date();
  const dbCoupon = await Coupon.findOne({
    where: {
      code: normalizedCode,
      isActive: true,
      [Op.and]: [
        { [Op.or]: [{ startsAt: null }, { startsAt: { [Op.lte]: now } }] },
        { [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gte]: now } }] },
        { [Op.or]: [{ maxUses: null }, { maxUses: { [Op.gt]: col('uses') } }] },
        { [Op.or]: [{ minOrderValue: null }, { minOrderValue: { [Op.lte]: subtotal } }] }
      ]
    }
  });

  if (dbCoupon) return { coupon: normalizeCoupon(dbCoupon), message: 'Cupom aplicado.' };

  const fallbackCoupons = {
    DUUG10: { code: 'DUUG10', type: 'percent', value: 10, label: '10% OFF' },
    FLASH15: { code: 'FLASH15', type: 'percent', value: 15, label: '15% OFF relampago' },
    PRIMEIRA20: { code: 'PRIMEIRA20', type: 'fixed', value: 20, label: 'R$ 20 OFF' }
  };

  const fallback = fallbackCoupons[normalizedCode];
  if (!fallback) return { coupon: null, message: 'Cupom nao encontrado ou expirado.' };
  if (normalizedCode === 'PRIMEIRA20' && subtotal < 120) {
    return { coupon: null, message: 'Este cupom exige pedido minimo de R$ 120,00.' };
  }

  return { coupon: fallback, message: 'Cupom aplicado.' };
}

function cartPayload(req, extras = {}) {
  const cart = req.session.cart || [];
  const coupon = req.session.coupon || null;
  const totals = calculateCartTotals(cart, coupon);
  const couponMessage = req.session.couponMessage;
  delete req.session.couponMessage;

  return {
    cart,
    coupon,
    couponMessage,
    shippingOptions: [],
    ...totals,
    ...extras
  };
}

module.exports = {
  view(req, res) {
    res.render('store/cart', cartPayload(req));
  },
  add(req, res) {
    const cart = req.session.cart || [];
    cart.push({
      name: req.body.name,
      slug: req.body.slug,
      image: req.body.image,
      size: req.body.size,
      price: Number(req.body.price || 0),
      quantity: Number(req.body.quantity || 1)
    });
    req.session.cart = cart;
    if (req.body.buyNow === '1') return res.redirect('/checkout');
    res.redirect(req.body.redirectTo || '/carrinho');
  },
  remove(req, res) {
    const cart = req.session.cart || [];
    req.session.cart = cart.filter((_, index) => index !== Number(req.params.index));
    res.redirect('/carrinho');
  },
  async applyCoupon(req, res) {
    const cart = req.session.cart || [];
    const subtotal = calculateCartTotals(cart).subtotal;
    const { coupon, message } = await findCoupon(req.body.code, subtotal);
    req.session.coupon = coupon;
    req.session.couponMessage = message;
    res.redirect('/carrinho');
  },
  clearCoupon(req, res) {
    delete req.session.coupon;
    req.session.couponMessage = 'Cupom removido.';
    res.redirect('/carrinho');
  },
  async freight(req, res) {
    const options = await melhorEnvioService.calculateShipping({ zipcode: req.body.zipcode });
    res.render('store/cart', cartPayload(req, { shippingOptions: options }));
  },
  async productFreight(req, res) {
    const options = await melhorEnvioService.calculateShipping({ zipcode: req.body.zipcode });
    res.json({ ok: true, options });
  }
};
