const env = require('../config/env');

class MelhorEnvioService {
  isMock() {
    return env.melhorEnvio.env === 'sandbox' || !env.melhorEnvio.token;
  }

  async calculateShipping({ zipcode }) {
    if (this.isMock()) {
      return [
        { service: 'PAC Mock', price: 19.9, days: 7, id: 'pac_mock' },
        { service: 'SEDEX Mock', price: 29.9, days: 3, id: 'sedex_mock' }
      ];
    }
    throw new Error('Melhor Envio produção não implementado neste scaffold.');
  }

  async createShipment(order) {
    if (this.isMock()) return { id: `ship_mock_${Date.now()}`, labelUrl: '#', orderId: order.id };
    throw new Error('Melhor Envio produção não implementado neste scaffold.');
  }
}

module.exports = new MelhorEnvioService();
