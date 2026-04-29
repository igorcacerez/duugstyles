const { Product, ProductImage, ProductVariation, Category, Size, Color } = require('../models');
const slug = require('../helpers/slug');
const { publicUploadPath } = require('../middlewares/uploadMiddleware');

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

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null || value === '') return [];
  return [value];
}

function filesByField(files = [], fieldname) {
  return files.filter((file) => file.fieldname === fieldname);
}

function firstFileByField(files = [], fieldname) {
  return files.find((file) => file.fieldname === fieldname);
}

async function saveImages(product, body, files = []) {
  const existingCount = await ProductImage.count({ where: { productId: product.id } });
  const uploaded = filesByField(files, 'images').map((file) => publicUploadPath(file));
  const urls = asArray(body.imageUrls)
    .flatMap((value) => String(value || '').split(/\r?\n/))
    .map((value) => value.trim())
    .filter(Boolean);
  const legacyUrl = body.imageUrl ? [body.imageUrl] : [];
  const imageUrls = [...legacyUrl, ...urls, ...uploaded];

  await Promise.all(imageUrls.map((imageUrl, index) => ProductImage.create({
    productId: product.id,
    imageUrl,
    altText: body.altText || product.name,
    isMain: existingCount === 0 && index === 0
  })));
}

async function saveVariations(product, body, files = []) {
  const sizeIds = asArray(body.variationSizeId);
  const colorIds = asArray(body.variationColorId);
  const skus = asArray(body.variationSku);
  const prices = asArray(body.variationPrice);
  const stocks = asArray(body.variationStock);
  const imageUrls = asArray(body.variationImageUrl);

  await ProductVariation.destroy({ where: { productId: product.id } });

  const rows = sizeIds.map((sizeId, index) => {
    const colorId = colorIds[index];
    const sku = skus[index] || `${product.slug}-${index + 1}`;
    const uploaded = firstFileByField(files, `variationImage_${index}`);
    const imageUrl = publicUploadPath(uploaded) || imageUrls[index] || null;

    if (!sizeId && !colorId && !skus[index] && !prices[index] && !stocks[index]) return null;
    return {
      productId: product.id,
      sizeId: sizeId || null,
      colorId: colorId || null,
      sku,
      price: prices[index] || product.promoPrice || product.price,
      stock: stocks[index] || 0,
      imageUrl
    };
  }).filter(Boolean);

  if (rows.length) await ProductVariation.bulkCreate(rows);
}

module.exports = {
  async list(req, res) {
    const products = await Product.findAll({ include: [Category, ProductImage, ProductVariation], order: [['createdAt', 'DESC']] });
    res.render('admin/products/index', { products });
  },
  async createPage(req, res) {
    const [categories, sizes, colors] = await Promise.all([Category.findAll(), Size.findAll(), Color.findAll()]);
    res.render('admin/products/form', { product: null, categories, sizes, colors });
  },
  async create(req, res) {
    const product = await Product.create(payload(req.body));
    await saveImages(product, req.body, req.files);
    await saveVariations(product, req.body, req.files);
    res.redirect('/admin/produtos');
  },
  async editPage(req, res) {
    const [product, categories, sizes, colors] = await Promise.all([
      Product.findByPk(req.params.id, {
        include: [
          ProductImage,
          { model: ProductVariation, required: false, include: [Size, Color] }
        ]
      }),
      Category.findAll(),
      Size.findAll(),
      Color.findAll()
    ]);
    if (!product) return res.redirect('/admin/produtos');
    res.render('admin/products/form', { product, categories, sizes, colors });
  },
  async update(req, res) {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.redirect('/admin/produtos');
    await product.update(payload(req.body));
    await saveImages(product, req.body, req.files);
    await saveVariations(product, req.body, req.files);
    res.redirect('/admin/produtos');
  },
  async remove(req, res) {
    const product = await Product.findByPk(req.params.id);
    if (product) await product.update({ isActive: false });
    res.redirect('/admin/produtos');
  },
  async removeImage(req, res) {
    await ProductImage.destroy({ where: { id: req.params.imageId, productId: req.params.id } });
    res.redirect(`/admin/produtos/${req.params.id}/editar`);
  }
};
