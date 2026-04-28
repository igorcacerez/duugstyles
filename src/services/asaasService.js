const env = require('../config/env');

class AsaasService {
  isMock() {
    return env.asaas.env === 'sandbox' || !env.asaas.apiKey;
  }

  async createCustomer(customer) {
    if (this.isMock()) return { id: `cus_mock_${Date.now()}`, ...customer };
    throw new Error('Asaas produção não implementado neste scaffold.');
  }

  async createCharge(payload) {
    if (this.isMock()) {
      return { id: `pay_mock_${Date.now()}`, status: 'PENDING', invoiceUrl: '#', pixQrCode: '000201010212...', ...payload };
    }
    throw new Error('Asaas produção não implementado neste scaffold.');
  }

  async getChargeStatus() {
    return this.isMock() ? 'RECEIVED' : 'PENDING';
  }
}

module.exports = new AsaasService();
