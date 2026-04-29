const settingsService = require('../services/settingsService');

module.exports = {
  async edit(req, res) {
    const settings = await settingsService.all();
    res.render('admin/settings/form', { settings, defaults: settingsService.defaults });
  },
  async update(req, res) {
    await settingsService.upsertMany(req.body);
    res.redirect('/admin/configuracoes');
  }
};
