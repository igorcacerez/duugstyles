const { Banner } = require('../models');
const { publicUploadPath } = require('../middlewares/uploadMiddleware');

function payload(body, file) {
  return {
    title: body.title,
    subtitle: body.subtitle,
    imageUrl: publicUploadPath(file) || body.currentImageUrl || '/public/images/hero-streetwear-duug.png',
    link: body.link,
    position: body.position || 'hero',
    sortOrder: Number(body.sortOrder || 0),
    isActive: body.isActive === 'on'
  };
}

module.exports = {
  async list(req, res) {
    const banners = await Banner.findAll({ order: [['sortOrder', 'ASC']] });
    res.render('admin/banners/index', { banners });
  },
  createPage(req, res) {
    res.render('admin/banners/form', { banner: null });
  },
  async create(req, res) {
    await Banner.create(payload(req.body, req.file));
    res.redirect('/admin/banners');
  },
  async editPage(req, res) {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.redirect('/admin/banners');
    res.render('admin/banners/form', { banner });
  },
  async update(req, res) {
    const banner = await Banner.findByPk(req.params.id);
    if (banner) await banner.update(payload(req.body, req.file));
    res.redirect('/admin/banners');
  },
  async remove(req, res) {
    const banner = await Banner.findByPk(req.params.id);
    if (banner) await banner.update({ isActive: false });
    res.redirect('/admin/banners');
  }
};
