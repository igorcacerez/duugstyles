(() => {
  const wishlistKey = 'duugstyles:wishlist';

  function money(value) {
    return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function readWishlist() {
    try {
      return JSON.parse(localStorage.getItem(wishlistKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function writeWishlist(items) {
    localStorage.setItem(wishlistKey, JSON.stringify(items));
  }

  function productFromButton(button) {
    return {
      id: button.dataset.id,
      name: button.dataset.name,
      price: Number(button.dataset.price || 0),
      url: button.dataset.url,
      image: button.dataset.image
    };
  }

  function updateWishlistUi() {
    const items = readWishlist();
    const ids = new Set(items.map((item) => item.id));
    document.querySelectorAll('[data-wishlist-count]').forEach((node) => {
      node.textContent = String(items.length);
    });
    document.querySelectorAll('[data-wishlist]').forEach((button) => {
      const isActive = ids.has(button.dataset.id);
      button.classList.toggle('is-active', isActive);
      if (button.classList.contains('wishlist-wide')) {
        button.lastChild.textContent = isActive ? ' Remover da lista de desejos' : ' Salvar na lista de desejos';
      }
    });
  }

  function toggleWishlist(button) {
    const product = productFromButton(button);
    if (!product.id) return;
    const items = readWishlist();
    const exists = items.some((item) => item.id === product.id);
    const next = exists ? items.filter((item) => item.id !== product.id) : [product, ...items];
    writeWishlist(next);
    updateWishlistUi();
    renderWishlistPage();
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[char]));
  }

  function renderWishlistPage() {
    const list = document.querySelector('[data-wishlist-page]');
    const empty = document.querySelector('[data-wishlist-empty]');
    if (!list) return;

    const items = readWishlist();
    list.innerHTML = items.map((item) => `
      <article class="wishlist-item">
        <a href="${escapeHtml(item.url)}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy"></a>
        <div class="wishlist-item-body">
          <h2>${escapeHtml(item.name)}</h2>
          <strong class="price">${money(item.price)}</strong>
          <form action="/carrinho" method="post" data-loading-form>
            <input type="hidden" name="name" value="${escapeHtml(item.name)}">
            <input type="hidden" name="slug" value="${escapeHtml(item.id)}">
            <input type="hidden" name="price" value="${Number(item.price || 0).toFixed(2)}">
            <input type="hidden" name="quantity" value="1">
            <input type="hidden" name="image" value="${escapeHtml(item.image)}">
            <input type="hidden" name="buyNow" value="1">
            <button class="btn btn-gold checkout-button" type="submit">Comprar agora</button>
          </form>
          <button class="btn btn-ghost" type="button" data-wishlist data-id="${escapeHtml(item.id)}" data-name="${escapeHtml(item.name)}" data-price="${Number(item.price || 0).toFixed(2)}" data-url="${escapeHtml(item.url)}" data-image="${escapeHtml(item.image)}">Remover</button>
        </div>
      </article>
    `).join('');

    if (empty) empty.hidden = items.length > 0;
    if (window.lucide) window.lucide.createIcons();
  }

  function initCountdown() {
    document.querySelectorAll('[data-flash-countdown]').forEach((countdown) => {
      const duration = Number(countdown.dataset.durationMinutes || 180);
      const storageKey = `duugstyles:flash:end:${duration}`;
      let end = Number(localStorage.getItem(storageKey));
      if (!end || end < Date.now()) {
        end = Date.now() + duration * 60 * 1000;
        localStorage.setItem(storageKey, String(end));
      }

      const hoursNode = countdown.querySelector('[data-hours]');
      const minutesNode = countdown.querySelector('[data-minutes]');
      const secondsNode = countdown.querySelector('[data-seconds]');

      const tick = () => {
        const remaining = Math.max(0, end - Date.now());
        const totalSeconds = Math.floor(remaining / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        hoursNode.textContent = String(hours).padStart(2, '0');
        minutesNode.textContent = String(minutes).padStart(2, '0');
        secondsNode.textContent = String(seconds).padStart(2, '0');
        countdown.classList.toggle('is-ended', remaining === 0);
      };

      tick();
      setInterval(tick, 1000);
    });
  }

  function initSizeGuide() {
    const chart = [
      { size: 'P', chest: [84, 92], waist: [70, 78], height: [160, 170] },
      { size: 'M', chest: [92, 100], waist: [78, 86], height: [170, 178] },
      { size: 'G', chest: [100, 108], waist: [86, 94], height: [176, 184] },
      { size: 'GG', chest: [108, 116], waist: [94, 104], height: [182, 190] },
      { size: 'XG', chest: [116, 126], waist: [104, 114], height: [188, 200] }
    ];

    document.querySelectorAll('[data-size-guide]').forEach((guide) => {
      const result = guide.querySelector('[data-size-result]');
      const button = guide.querySelector('[data-size-calculate]');
      if (!button || !result) return;

      button.addEventListener('click', () => {
        const chest = Number(guide.querySelector('[data-chest]').value);
        const waist = Number(guide.querySelector('[data-waist]').value);
        const height = Number(guide.querySelector('[data-height]').value);
        if (!chest || !waist || !height) {
          result.textContent = 'Preencha torax, cintura e altura para receber uma recomendacao.';
          return;
        }

        const scored = chart.map((entry) => {
          const chestScore = Math.abs(chest - ((entry.chest[0] + entry.chest[1]) / 2));
          const waistScore = Math.abs(waist - ((entry.waist[0] + entry.waist[1]) / 2));
          const heightScore = Math.abs(height - ((entry.height[0] + entry.height[1]) / 2)) / 2;
          return { ...entry, score: chestScore + waistScore + heightScore };
        }).sort((a, b) => a.score - b.score);

        const best = scored[0];
        result.textContent = `Tamanho recomendado: ${best.size}. Para caimento mais solto, escolha um tamanho acima.`;
        const input = document.querySelector(`.size-options input[value="${best.size}"]`);
        if (input) input.checked = true;
      });
    });
  }

  function initProductFreight() {
    document.querySelectorAll('[data-product-freight]').forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const results = document.querySelector('[data-freight-results]');
        const zipcode = new FormData(form).get('zipcode');
        if (!results) return;
        results.classList.add('show');
        results.innerHTML = '<div><strong>Calculando...</strong><span>Aguarde</span></div>';

        try {
          const response = await fetch('/produto/frete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ zipcode })
          });
          const payload = await response.json();
          results.innerHTML = payload.options.map((option) => `
            <div><strong>${escapeHtml(option.service)}</strong><span>${money(option.price)} · ${escapeHtml(option.days)} dias</span></div>
          `).join('');
        } catch (error) {
          results.innerHTML = '<div><strong>Nao foi possivel calcular</strong><span>Tente novamente</span></div>';
        }
      });
    });
  }

  function initBuyNow() {
    document.querySelectorAll('[data-buy-now-button]').forEach((button) => {
      button.addEventListener('click', () => {
        const input = button.form?.querySelector('[data-buy-now-input]');
        if (input) input.value = '1';
      });
    });

    document.querySelectorAll('.buy-actions button:not([data-buy-now-button])').forEach((button) => {
      button.addEventListener('click', () => {
        const input = button.form?.querySelector('[data-buy-now-input]');
        if (input) input.value = '0';
      });
    });
  }

  function initLoadingForms() {
    document.addEventListener('submit', (event) => {
      const form = event.target.closest('[data-loading-form]');
      if (!form) return;
      const submitter = event.submitter || form.querySelector('button[type="submit"]');
      if (!submitter) return;
      submitter.disabled = true;
      submitter.dataset.originalText = submitter.textContent;
      submitter.textContent = 'Processando...';
    });
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-wishlist]');
    if (button) toggleWishlist(button);
  });

  initCountdown();
  initSizeGuide();
  initProductFreight();
  initBuyNow();
  initLoadingForms();
  updateWishlistUi();
  renderWishlistPage();

  if (window.lucide) window.lucide.createIcons();
})();
