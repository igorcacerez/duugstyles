const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const env = require('./config/env');
const { Product, Category } = require('./models');
const settingsService = require('./services/settingsService');
const storeRoutes = require('./routes/storeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: env.app.url, credentials: true }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(session({ secret: env.sessionSecret, resave: false, saveUninitialized: false, cookie: { httpOnly: true, sameSite: 'lax' } }));
app.use('/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }));
app.use('/checkout', rateLimit({ windowMs: 15 * 60 * 1000, limit: 50 }));

app.use(async (req, res, next) => {
  try {
    res.locals.brand = 'Duug Styles';
    res.locals.path = req.path;
    res.locals.appUrl = env.app.url;
    res.locals.meta = null;
    res.locals.storeSettings = await settingsService.all();
    res.locals.cartCount = (req.session.cart || []).reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    res.locals.assetUrl = (assetPath, fallback = '/public/images/promo-flatlay-duug.png') => {
      const finalPath = assetPath || fallback;
      if (/^https?:\/\//i.test(finalPath)) return finalPath;
      if (finalPath.startsWith('/public/')) return finalPath;
      if (finalPath.startsWith('/images/')) return `/public${finalPath}`;
      return finalPath;
    };
    next();
  } catch (error) {
    next(error);
  }
});

app.get('/robots.txt', (req, res) => res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: ' + env.app.url + '/sitemap.xml'));
app.get('/sitemap.xml', async (req, res, next) => {
  try {
    const [products, categories] = await Promise.all([
      Product.findAll({ where: { isActive: true }, attributes: ['slug', 'updatedAt'] }),
      Category.findAll({ where: { isActive: true }, attributes: ['slug', 'updatedAt'] })
    ]);
    const urls = [
      { loc: env.app.url, priority: '1.0' },
      { loc: `${env.app.url}/busca`, priority: '0.7' },
      ...categories.map((category) => ({ loc: `${env.app.url}/categoria/${category.slug}`, updatedAt: category.updatedAt, priority: '0.8' })),
      ...products.map((product) => ({ loc: `${env.app.url}/produto/${product.slug}`, updatedAt: product.updatedAt, priority: '0.9' }))
    ];
    const body = urls.map((url) => `<url><loc>${url.loc}</loc>${url.updatedAt ? `<lastmod>${url.updatedAt.toISOString()}</lastmod>` : ''}<priority>${url.priority}</priority></url>`).join('');
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`);
  } catch (error) {
    next(error);
  }
});

app.use('/', storeRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => res.status(404).render('errors/404', { title: 'Página não encontrada' }));
app.use(errorMiddleware);

module.exports = app;
