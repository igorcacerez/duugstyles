const { Size, Color } = require('../models');

module.exports = {
  async sizes(req, res) {
    const sizes = await Size.findAll({ order: [['name', 'ASC']] });
    res.render('admin/attributes/sizes', { sizes });
  },
  async createSize(req, res) {
    await Size.create({ name: req.body.name, isActive: req.body.isActive === 'on' });
    res.redirect('/admin/tamanhos');
  },
  async updateSize(req, res) {
    const size = await Size.findByPk(req.params.id);
    if (size) await size.update({ name: req.body.name, isActive: req.body.isActive === 'on' });
    res.redirect('/admin/tamanhos');
  },
  async colors(req, res) {
    const colors = await Color.findAll({ order: [['name', 'ASC']] });
    res.render('admin/attributes/colors', { colors });
  },
  async createColor(req, res) {
    await Color.create({ name: req.body.name, hexCode: req.body.hexCode, isActive: req.body.isActive === 'on' });
    res.redirect('/admin/cores');
  },
  async updateColor(req, res) {
    const color = await Color.findByPk(req.params.id);
    if (color) await color.update({ name: req.body.name, hexCode: req.body.hexCode, isActive: req.body.isActive === 'on' });
    res.redirect('/admin/cores');
  }
};
