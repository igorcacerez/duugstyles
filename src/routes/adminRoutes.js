const { Router } = require('express');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const adminProductController = require('../controllers/adminProductController');
const adminCategoryController = require('../controllers/adminCategoryController');
const adminBannerController = require('../controllers/adminBannerController');
const adminCouponController = require('../controllers/adminCouponController');
const adminOrderController = require('../controllers/adminOrderController');
const adminCustomerController = require('../controllers/adminCustomerController');
const adminSettingsController = require('../controllers/adminSettingsController');
const adminAttributeController = require('../controllers/adminAttributeController');
const { ensureAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

const router = Router();
router.get('/login', authController.adminLoginPage);
router.post('/login', authController.adminLogin);

router.use(ensureAdmin, (req, res, next) => {
  res.locals.layout = 'layouts/admin';
  next();
});

router.get('/', adminController.dashboard);

router.get('/produtos', adminProductController.list);
router.get('/produtos/novo', adminProductController.createPage);
router.post('/produtos', upload.any(), adminProductController.create);
router.get('/produtos/:id/editar', adminProductController.editPage);
router.post('/produtos/:id', upload.any(), adminProductController.update);
router.post('/produtos/:id/remover', adminProductController.remove);
router.post('/produtos/:id/imagens/:imageId/remover', adminProductController.removeImage);

router.get('/categorias', adminCategoryController.list);
router.get('/categorias/nova', adminCategoryController.createPage);
router.post('/categorias', adminCategoryController.create);
router.get('/categorias/:id/editar', adminCategoryController.editPage);
router.post('/categorias/:id', adminCategoryController.update);
router.post('/categorias/:id/remover', adminCategoryController.remove);

router.get('/tamanhos', adminAttributeController.sizes);
router.post('/tamanhos', adminAttributeController.createSize);
router.post('/tamanhos/:id', adminAttributeController.updateSize);
router.get('/cores', adminAttributeController.colors);
router.post('/cores', adminAttributeController.createColor);
router.post('/cores/:id', adminAttributeController.updateColor);

router.get('/banners', adminBannerController.list);
router.get('/banners/novo', adminBannerController.createPage);
router.post('/banners', upload.single('imageFile'), adminBannerController.create);
router.get('/banners/:id/editar', adminBannerController.editPage);
router.post('/banners/:id', upload.single('imageFile'), adminBannerController.update);
router.post('/banners/:id/remover', adminBannerController.remove);

router.get('/cupons', adminCouponController.list);
router.get('/cupons/novo', adminCouponController.createPage);
router.post('/cupons', adminCouponController.create);
router.get('/cupons/:id/editar', adminCouponController.editPage);
router.post('/cupons/:id', adminCouponController.update);
router.post('/cupons/:id/remover', adminCouponController.remove);

router.get('/pedidos', adminOrderController.list);
router.get('/pedidos/:id', adminOrderController.detail);
router.post('/pedidos/:id/status', adminOrderController.updateStatus);

router.get('/clientes', adminCustomerController.list);
router.get('/clientes/:id', adminCustomerController.detail);
router.post('/clientes/:id/bloqueio', adminCustomerController.toggleBlock);

router.get('/configuracoes', adminSettingsController.edit);
router.post('/configuracoes', adminSettingsController.update);

module.exports = router;
