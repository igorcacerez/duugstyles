const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

module.exports = {
  app: {
    name: process.env.APP_NAME || 'Duug Styles',
    url: process.env.APP_URL || 'http://localhost:3000',
    port: Number(process.env.APP_PORT || 3000),
    env: process.env.NODE_ENV || 'development'
  },
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: 'mysql'
  },
  sessionSecret: process.env.SESSION_SECRET || 'duug-styles-secret',
  asaas: {
    baseUrl: process.env.ASAAS_BASE_URL,
    apiKey: process.env.ASAAS_API_KEY,
    env: process.env.ASAAS_ENV || 'sandbox'
  },
  melhorEnvio: {
    baseUrl: process.env.MELHOR_ENVIO_BASE_URL,
    token: process.env.MELHOR_ENVIO_TOKEN,
    env: process.env.MELHOR_ENVIO_ENV || 'sandbox'
  }
};
