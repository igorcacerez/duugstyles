const { Setting } = require('../models');

const defaults = {
  site_title: 'Duug Styles | Moda Masculina Streetwear',
  site_description: 'Streetwear masculino premium com identidade urbana, camisetas oversized, moletons e ofertas exclusivas.',
  hero_eyebrow: 'Drop premium masculino',
  hero_title: 'Duug Styles Streetwear Masculino',
  hero_description: 'Camisetas oversized, moletons pesados e pecas urbanas com compra rapida, frete visivel e ofertas para fechar o pedido sem atrito.',
  hero_primary_label: 'Comprar agora',
  hero_primary_link: '/busca',
  hero_secondary_label: 'Ver camisetas',
  hero_secondary_link: '/categoria/camisetas',
  flash_eyebrow: 'Promocao relampago',
  flash_title: 'Use FLASH15 antes que o contador zere',
  flash_coupon: 'FLASH15',
  flash_duration_minutes: '180',
  flash_link: '/busca?promo=flash',
  footer_description: 'Streetwear masculino premium para quem quer comprar rapido, vestir melhor e receber com previsibilidade.',
  trust_shipping: 'Frete calculado no produto',
  trust_payment: 'Compra rapida e pagamento seguro',
  trust_exchange: 'Troca facil em ate 7 dias',
  checkout_pix_label: 'PIX',
  checkout_card_label: 'Cartao',
  checkout_boleto_label: 'Boleto',
  page_sobre_title: 'Sobre',
  page_sobre_body: 'Conte a historia da marca, posicionamento, diferenciais e proposta de valor.',
  page_contato_title: 'Contato',
  page_contato_body: 'Informe canais de atendimento, horarios e prazos de resposta.',
  page_politica_de_privacidade_title: 'Politica de privacidade',
  page_politica_de_privacidade_body: 'Explique como os dados dos clientes sao coletados, tratados e protegidos.',
  page_termos_de_uso_title: 'Termos de uso',
  page_termos_de_uso_body: 'Descreva regras de uso da loja, pedidos, pagamentos e responsabilidades.',
  page_trocas_e_devolucoes_title: 'Trocas e devolucoes',
  page_trocas_e_devolucoes_body: 'Explique prazos, condicoes e processo de troca ou devolucao.',
  page_faq_title: 'FAQ',
  page_faq_body: 'Liste perguntas frequentes sobre tamanhos, frete, pagamento e entrega.',
  page_recuperar_senha_title: 'Recuperar senha',
  page_recuperar_senha_body: 'Oriente o cliente a entrar em contato para recuperar o acesso.'
};

function normalizePageKey(slug) {
  return String(slug || '').replaceAll('-', '_');
}

async function all() {
  const records = await Setting.findAll();
  return records.reduce((map, setting) => {
    map[setting.key] = setting.value;
    return map;
  }, { ...defaults });
}

async function upsertMany(payload) {
  const entries = Object.entries(payload)
    .filter(([key]) => Object.prototype.hasOwnProperty.call(defaults, key))
    .map(([key, value]) => [key, value == null ? '' : String(value)]);

  await Promise.all(entries.map(([key, value]) => Setting.upsert({ key, value })));
}

async function page(slug) {
  const settings = await all();
  const key = normalizePageKey(slug);
  return {
    title: settings[`page_${key}_title`] || slug.replaceAll('-', ' '),
    body: settings[`page_${key}_body`] || 'Conteudo institucional editavel pelo painel administrativo.'
  };
}

module.exports = { all, defaults, page, upsertMany };
