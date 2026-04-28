const { Product, Category } = require('../models');
const slug = require('../helpers/slug');

module.exports = {
  async list(req, res) {
    const products = await Product.findAll({ include: [Category] });
    res.render('admin/products/index', { products });
  },
  async createPage(req, res) {
    const categories = await Category.findAll();
    res.render('admin/products/form', { product: null, categories });
  },
  async create(req, res) {
    await Product.create({ ...req.body, slug: req.body.slug || slug(req.body.name) });
    res.redirect('/admin/produtos');
  }
};
