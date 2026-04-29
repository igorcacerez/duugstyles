const { Product, ProductImage, Category } = require('../models');
const slug = require('../helpers/slug');

function payload(body) {
  return {
    categoryId: body.categoryId || null,
    name: body.name,
    slug: body.slug || slug(body.name),
    descriptionShort: body.descriptionShort,
    descriptionLong: body.descriptionLong,
    price: body.price || 0,
    promoPrice: body.promoPrice || null,
    cost: body.cost || null,
    isFeatured: body.isFeatured === 'on',
    isNew: body.isNew === 'on',
    isBestSeller: body.isBestSeller === 'on',
    isActive: body.isActive === 'on',
    metaTitle: body.metaTitle,
    metaDescription: body.metaDescription,
    keywords: body.keywords,
    weight: body.weight || null,
    height: body.height || null,
    width: body.width || null,
    length: body.length || null
  };
}

async function saveMainImage(product, body) {
  if (!body.imageUrl) return;
  const existing = await ProductImage.findOne({ where: { productId: product.id, isMain: true } });
  const data = { productId: product.id, imageUrl: body.imageUrl, altText: body.altText || product.name, isMain: true };
  if (existing) return existing.update(data);
  return ProductImage.create(data);
}

module.exports = {
  async list(req, res) {
    const products = await Product.findAll({ include: [Category, ProductImage], order: [['createdAt', 'DESC']] });
    res.render('admin/products/index', { products });
  },
  async createPage(req, res) {
    const categories = await Category.findAll();
    res.render('admin/products/form', { product: null, categories });
  },
  async create(req, res) {
    const product = await Product.create(payload(req.body));
    await saveMainImage(product, req.body);
    res.redirect('/admin/produtos');
  },
  async editPage(req, res) {
    const [product, categories] = await Promise.all([
      Product.findByPk(req.params.id, { include: [ProductImage] }),
      Category.findAll()
    ]);
    if (!product) return res.redirect('/admin/produtos');
    res.render('admin/products/form', { product, categories });
  },
  async update(req, res) {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.redirect('/admin/produtos');
    await product.update(payload(req.body));
    await saveMainImage(product, req.body);
    res.redirect('/admin/produtos');
  },
  async remove(req, res) {
    const product = await Product.findByPk(req.params.id);
    if (product) await product.update({ isActive: false });
    res.redirect('/admin/produtos');
  }
};
