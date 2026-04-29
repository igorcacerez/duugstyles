const { Coupon } = require('../models');

function dateOrNull(value) {
  return value ? new Date(value) : null;
}

function payload(body) {
  return {
    code: String(body.code || '').trim().toUpperCase(),
    type: body.type,
    value: Number(body.value || 0),
    startsAt: dateOrNull(body.startsAt),
    expiresAt: dateOrNull(body.expiresAt),
    maxUses: body.maxUses || null,
    uses: body.uses || 0,
    minOrderValue: body.minOrderValue || 0,
    isActive: body.isActive === 'on'
  };
}

module.exports = {
  async list(req, res) {
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    res.render('admin/coupons/index', { coupons });
  },
  createPage(req, res) {
    res.render('admin/coupons/form', { coupon: null });
  },
  async create(req, res) {
    await Coupon.create(payload(req.body));
    res.redirect('/admin/cupons');
  },
  async editPage(req, res) {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.redirect('/admin/cupons');
    res.render('admin/coupons/form', { coupon });
  },
  async update(req, res) {
    const coupon = await Coupon.findByPk(req.params.id);
    if (coupon) await coupon.update(payload(req.body));
    res.redirect('/admin/cupons');
  },
  async remove(req, res) {
    const coupon = await Coupon.findByPk(req.params.id);
    if (coupon) await coupon.update({ isActive: false });
    res.redirect('/admin/cupons');
  }
};
