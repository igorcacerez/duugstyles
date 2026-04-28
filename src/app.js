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

app.use((req, res, next) => {
  res.locals.brand = 'Duug Styles';
  res.locals.path = req.path;
  next();
});

app.get('/robots.txt', (req, res) => res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: ' + env.app.url + '/sitemap.xml'));
app.get('/sitemap.xml', (req, res) => res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${env.app.url}</loc></url></urlset>`));

app.use('/', storeRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => res.status(404).render('errors/404', { title: 'Página não encontrada' }));
app.use(errorMiddleware);

module.exports = app;
