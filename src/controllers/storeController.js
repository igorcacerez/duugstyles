const { Op } = require('sequelize');
const { Banner, Product, ProductImage, ProductVariation, Size, Color, Category } = require('../models');
const seoService = require('../services/seoService');

const productInclude = [
  { model: ProductImage, required: false, order: [['isMain', 'DESC']] }
];

module.exports = {
  async home(req, res) {
    const [banners, featured, newest, bestSellers, categories] = await Promise.all([
      Banner.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC']] }),
      Product.findAll({ where: { isFeatured: true, isActive: true }, include: productInclude, limit: 8 }),
      Product.findAll({ where: { isNew: true, isActive: true }, include: productInclude, limit: 8 }),
      Product.findAll({ where: { isBestSeller: true, isActive: true }, include: productInclude, limit: 8 }),
      Category.findAll({ where: { isActive: true }, limit: 8 })
    ]);

    res.render('store/home', {
      meta: seoService.buildMeta({
        description: 'Compre streetwear masculino premium na Duug Styles. Camisetas oversized, moletons e pecas urbanas com compra rapida, frete e ofertas relampago.'
      }),
      banners,
      featured,
      newest,
      bestSellers,
      categories
    });
  },

  async category(req, res) {
    const category = await Category.findOne({ where: { slug: req.params.slug } });
    if (!category) return res.status(404).render('errors/404', { meta: seoService.buildMeta({ title: 'Categoria nao encontrada' }) });

    const products = await Product.findAll({ where: { categoryId: category.id, isActive: true }, include: productInclude });
    res.render('store/category', {
      category,
      products,
      meta: seoService.buildMeta({
        title: category.metaTitle || `${category.name} Duug Styles`,
        description: category.metaDescription || category.seoText,
        canonical: `/categoria/${category.slug}`
      })
    });
  },

  async product(req, res) {
    const product = await Product.findOne({
      where: { slug: req.params.slug, isActive: true },
      include: [
        { model: ProductImage, required: false },
        { model: ProductVariation, required: false, include: [{ model: Size, required: false }, { model: Color, required: false }] },
        { model: Category, required: false }
      ]
    });
    if (!product) return res.status(404).render('errors/404', { meta: seoService.buildMeta({ title: 'Produto nao encontrado' }) });

    const related = await Product.findAll({
      where: { categoryId: product.categoryId, isActive: true, id: { [Op.ne]: product.id } },
      include: productInclude,
      limit: 4
    });

    res.render('store/product', {
      product,
      related,
      meta: seoService.buildMeta({
        title: product.metaTitle || `${product.name} | Duug Styles`,
        description: product.metaDescription || product.descriptionShort,
        canonical: `/produto/${product.slug}`,
        image: product.ProductImages?.[0]?.imageUrl
      })
    });
  },

  async search(req, res) {
    const q = String(req.query.q || '').trim();
    const where = q
      ? { isActive: true, [Op.or]: [{ name: { [Op.like]: `%${q}%` } }, { keywords: { [Op.like]: `%${q}%` } }] }
      : { isActive: true };
    const products = await Product.findAll({ where, include: productInclude, limit: 24 });
    res.render('store/search', {
      q,
      products,
      meta: seoService.buildMeta({
        title: q ? `Busca por ${q} | Duug Styles` : 'Buscar streetwear masculino | Duug Styles',
        description: 'Encontre camisetas oversized, moletons e pecas streetwear masculinas na Duug Styles.',
        canonical: '/busca'
      })
    });
  },

  wishlist(req, res) {
    res.render('store/wishlist', {
      meta: seoService.buildMeta({
        title: 'Lista de desejos | Duug Styles',
        description: 'Salve seus produtos favoritos da Duug Styles e compre mais rapido quando quiser.'
      })
    });
  }
};
