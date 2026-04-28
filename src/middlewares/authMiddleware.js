module.exports = {
  ensureAdmin(req, res, next) {
    if (req.session?.admin) return next();
    return res.redirect('/admin/login');
  },
  ensureCustomer(req, res, next) {
    if (req.session?.customer) return next();
    return res.redirect('/login');
  }
};
