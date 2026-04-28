const { Router } = require('express');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const adminProductController = require('../controllers/adminProductController');
const { ensureAdmin } = require('../middlewares/authMiddleware');

const router = Router();
router.get('/login', authController.adminLoginPage);
router.post('/login', authController.adminLogin);
router.get('/', ensureAdmin, adminController.dashboard);
router.get('/produtos', ensureAdmin, adminProductController.list);
router.get('/produtos/novo', ensureAdmin, adminProductController.createPage);
router.post('/produtos', ensureAdmin, adminProductController.create);

module.exports = router;
