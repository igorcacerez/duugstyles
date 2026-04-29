const { Router } = require('express');
const storeController = require('../controllers/storeController');
const cartController = require('../controllers/cartController');
const checkoutController = require('../controllers/checkoutController');
const authController = require('../controllers/authController');
const customerController = require('../controllers/customerController');
const { ensureCustomer } = require('../middlewares/authMiddleware');

const router = Router();
router.get('/', storeController.home);
router.get('/categoria/:slug', storeController.category);
router.get('/produto/:slug', storeController.product);
router.post('/produto/frete', cartController.productFreight);
router.get('/busca', storeController.search);
router.get('/favoritos', storeController.wishlist);
router.get('/carrinho', cartController.view);
router.post('/carrinho', cartController.add);
router.post('/carrinho/frete', cartController.freight);
router.post('/carrinho/cupom', cartController.applyCoupon);
router.post('/carrinho/cupom/remover', cartController.clearCoupon);
router.post('/carrinho/remover/:index', cartController.remove);
router.get('/checkout', checkoutController.page);
router.post('/checkout', checkoutController.process);
router.get('/checkout/sucesso', checkoutController.success);
router.post('/webhooks/asaas', checkoutController.webhook);

router.get('/login', authController.loginPage);
router.post('/login', authController.login);
router.get('/cadastro', authController.registerPage);
router.post('/cadastro', authController.register);
router.post('/logout', authController.logout);
router.get('/minha-conta', ensureCustomer, customerController.account);
router.get('/meus-pedidos', ensureCustomer, customerController.orders);
router.get('/meus-pedidos/:number', ensureCustomer, customerController.order);

['sobre','contato','politica-de-privacidade','termos-de-uso','trocas-e-devolucoes','faq','recuperar-senha'].forEach((slug)=>{
  router.get(`/${slug}`, storeController.staticPage);
});

module.exports = router;
