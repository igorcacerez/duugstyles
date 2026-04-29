'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const adminHash = await bcrypt.hash('Admin@123456', 10);
    await queryInterface.bulkInsert('users', [{ name: 'Admin Duug', email: 'admin@admin.com', password_hash: adminHash, role: 'admin', is_active: true, created_at: now, updated_at: now }]);

    await queryInterface.bulkInsert('categories', [
      { name: 'Camisetas', slug: 'camisetas', seo_text: 'Camisetas streetwear masculinas premium.', meta_title: 'Camisetas Duug Styles', meta_description: 'Camisetas exclusivas Duug Styles.', is_active: true, created_at: now, updated_at: now },
      { name: 'Moletons', slug: 'moletons', seo_text: 'Moletons pesados com identidade urbana.', meta_title: 'Moletons Duug Styles', meta_description: 'Moletons premium masculinos.', is_active: true, created_at: now, updated_at: now }
    ]);

    await queryInterface.bulkInsert('sizes', ['P','M','G','GG','XG'].map((name) => ({ name, is_active: true, created_at: now, updated_at: now })));
    await queryInterface.bulkInsert('colors', [
      { name: 'Preto', hex_code: '#050505', is_active: true, created_at: now, updated_at: now },
      { name: 'Dourado', hex_code: '#D99A0B', is_active: true, created_at: now, updated_at: now },
      { name: 'Branco', hex_code: '#FFFFFF', is_active: true, created_at: now, updated_at: now }
    ]);

    await queryInterface.bulkInsert('products', [
      { category_id: 1, name: 'Camiseta Oversized Duug Signature', slug: 'camiseta-oversized-duug-signature', description_short: 'Camiseta premium oversized.', description_long: 'Camiseta streetwear com acabamento premium e estampa de impacto.', price: 149.90, promo_price: 129.90, cost: 70.00, is_featured: true, is_new: true, is_best_seller: true, is_active: true, meta_title: 'Camiseta Oversized Duug', meta_description: 'Streetwear premium masculino.', keywords: 'camiseta,streetwear,duug', weight: 0.3, height: 5, width: 30, length: 25, created_at: now, updated_at: now },
      { category_id: 2, name: 'Moletom Duug Urban Skull', slug: 'moletom-duug-urban-skull', description_short: 'Moletom pesado premium.', description_long: 'Moletom com toque macio, modelagem urbana e visual agressivo.', price: 299.90, promo_price: 269.90, cost: 150.00, is_featured: true, is_new: true, is_best_seller: false, is_active: true, meta_title: 'Moletom Duug Urban', meta_description: 'Moletom streetwear masculino premium.', keywords: 'moletom,urbano,duug', weight: 0.8, height: 8, width: 35, length: 30, created_at: now, updated_at: now }
    ]);

    await queryInterface.bulkInsert('product_images', [
      { product_id: 1, image_url: '/public/images/promo-flatlay-duug.png', alt_text: 'Camiseta oversized Duug Styles em composicao streetwear premium', is_main: true, created_at: now, updated_at: now },
      { product_id: 2, image_url: '/public/images/promo-flatlay-duug.png', alt_text: 'Moletom masculino Duug Styles em composicao streetwear premium', is_main: true, created_at: now, updated_at: now }
    ]);

    await queryInterface.bulkInsert('product_variations', [
      { product_id: 1, size_id: 2, color_id: 1, sku: 'DUUG-CAM-SIG-M-PRETO', price: 129.90, stock: 20, image_url: '/public/images/promo-flatlay-duug.png', created_at: now, updated_at: now },
      { product_id: 1, size_id: 3, color_id: 3, sku: 'DUUG-CAM-SIG-G-BRANCO', price: 139.90, stock: 12, image_url: '/public/images/promo-flatlay-duug.png', created_at: now, updated_at: now },
      { product_id: 2, size_id: 3, color_id: 1, sku: 'DUUG-MOL-SKL-G-PRETO', price: 269.90, stock: 8, image_url: '/public/images/promo-flatlay-duug.png', created_at: now, updated_at: now },
      { product_id: 2, size_id: 4, color_id: 2, sku: 'DUUG-MOL-SKL-GG-DOURADO', price: 289.90, stock: 4, image_url: '/public/images/promo-flatlay-duug.png', created_at: now, updated_at: now }
    ]);

    await queryInterface.bulkInsert('banners', [
      { title: 'Duug Styles Streetwear Masculino', subtitle: 'Colecao premium masculina Duug Styles', image_url: '/public/images/hero-streetwear-duug.png', link: '/categoria/camisetas', position: 'hero', sort_order: 1, is_active: true, created_at: now, updated_at: now }
    ]);

    await queryInterface.bulkInsert('coupons', [
      { code: 'DUUG10', type: 'percent', value: 10.00, starts_at: now, expires_at: null, max_uses: null, uses: 0, min_order_value: 0, is_active: true, created_at: now, updated_at: now },
      { code: 'FLASH15', type: 'percent', value: 15.00, starts_at: now, expires_at: null, max_uses: null, uses: 0, min_order_value: 0, is_active: true, created_at: now, updated_at: now },
      { code: 'PRIMEIRA20', type: 'fixed', value: 20.00, starts_at: now, expires_at: null, max_uses: null, uses: 0, min_order_value: 120.00, is_active: true, created_at: now, updated_at: now }
    ]);

    await queryInterface.bulkInsert('settings', [
      { key: 'site_title', value: 'Duug Styles | Moda Masculina Streetwear', created_at: now, updated_at: now },
      { key: 'site_description', value: 'Compre roupas masculinas streetwear na Duug Styles. Estilo urbano, atitude e pecas exclusivas para quem vive a rua com personalidade.', created_at: now, updated_at: now }
    ]);
  },

  async down(queryInterface) {
    for (const table of ['settings','coupons','banners','product_variations','product_images','products','colors','sizes','categories','users']) {
      await queryInterface.bulkDelete(table, null, {});
    }
  }
};
