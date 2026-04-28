const bcrypt = require('bcryptjs');
const { Customer, User } = require('../models');

module.exports = {
  loginPage(req, res) { res.render('auth/login'); },
  registerPage(req, res) { res.render('auth/register'); },
  async register(req, res) {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    await Customer.create({ fullName: req.body.fullName, email: req.body.email, passwordHash, phone: req.body.phone, cpfCnpj: req.body.cpfCnpj });
    res.redirect('/login');
  },
  async login(req, res) {
    const customer = await Customer.findOne({ where: { email: req.body.email } });
    if (!customer || !(await bcrypt.compare(req.body.password, customer.passwordHash))) return res.redirect('/login');
    req.session.customer = { id: customer.id, email: customer.email };
    res.redirect('/meus-pedidos');
  },
  async adminLogin(req, res) {
    const user = await User.findOne({ where: { email: req.body.email, role: 'admin' } });
    if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.redirect('/admin/login');
    req.session.admin = { id: user.id, email: user.email };
    res.redirect('/admin');
  },
  adminLoginPage(req, res) { res.render('admin/login', { layout: false }); },
  logout(req, res) { req.session.destroy(() => res.redirect('/')); }
};
