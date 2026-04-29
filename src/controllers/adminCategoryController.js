const { Category } = require('../models');
const slug = require('../helpers/slug');

function payload(body) {
  return {
    name: body.name,
    slug: body.slug || slug(body.name),
    seoText: body.seoText,
    metaTitle: body.metaTitle,
    metaDescription: body.metaDescription,
    isActive: body.isActive === 'on'
  };
}

module.exports = {
  async list(req, res) {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.render('admin/categories/index', { categories });
  },
  createPage(req, res) {
    res.render('admin/categories/form', { category: null });
  },
  async create(req, res) {
    await Category.create(payload(req.body));
    res.redirect('/admin/categorias');
  },
  async editPage(req, res) {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.redirect('/admin/categorias');
    res.render('admin/categories/form', { category });
  },
  async update(req, res) {
    const category = await Category.findByPk(req.params.id);
    if (category) await category.update(payload(req.body));
    res.redirect('/admin/categorias');
  },
  async remove(req, res) {
    const category = await Category.findByPk(req.params.id);
    if (category) await category.update({ isActive: false });
    res.redirect('/admin/categorias');
  }
};
