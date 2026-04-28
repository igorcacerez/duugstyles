const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    app.listen(env.app.port, () => {
      console.log(`${env.app.name} rodando em http://localhost:${env.app.port}`);
    });
  } catch (error) {
    console.error('Falha ao conectar no banco de dados:', error.message);
    process.exit(1);
  }
})();
