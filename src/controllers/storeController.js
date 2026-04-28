const { Banner, Product, Category } = require('../models');
const seoService = require('../services/seoService');

module.exports = {
  async home(req, res) {
    const [banners, featured, newest, bestSellers, categories] = await Promise.all([
      Banner.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC']] }),
      Product.findAll({ where: { isFeatured: true, isActive: true }, limit: 8 }),
      Product.findAll({ where: { isNew: true, isActive: true }, limit: 8 }),
      Product.findAll({ where: { isBestSeller: true, isActive: true }, limit: 8 }),
      Category.findAll({ where: { isActive: true }, limit: 8 })
    ]);

    res.render('store/home', { meta: seoService.buildMeta({}), banners, featured, newest, bestSellers, categories });
  },

  async category(req, res) {
    const category = await Category.findOne({ where: { slug: req.params.slug } });
    const products = await Product.findAll({ where: { categoryId: category?.id, isActive: true } });
    res.render('store/category', { category, products, meta: seoService.buildMeta({ title: category?.metaTitle, description: category?.metaDescription }) });
  },

  async product(req, res) {
    const product = await Product.findOne({ where: { slug: req.params.slug } });
    const related = await Product.findAll({ where: { categoryId: product?.categoryId, isActive: true }, limit: 4 });
    res.render('store/product', { product, related, meta: seoService.buildMeta({ title: product?.metaTitle, description: product?.metaDescription }) });
  },

  async search(req, res) {
    const q = req.query.q || '';
    const products = await Product.findAll({ where: { isActive: true } });
    const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    res.render('store/search', { q, products: filtered, meta: seoService.buildMeta({ title: `Busca: ${q}` }) });
  }
};
