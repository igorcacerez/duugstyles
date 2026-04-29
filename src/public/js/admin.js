(() => {
  function setupDropzone(dropzone) {
    const input = dropzone.querySelector('[data-dropzone-input]');
    const preview = dropzone.parentElement.querySelector('[data-upload-preview]');
    if (!input || !preview) return;

    const render = () => {
      preview.innerHTML = Array.from(input.files || []).map((file) => `
        <div class="upload-preview-card">
          <span>${file.name}</span>
          <small>${Math.round(file.size / 1024)} KB</small>
        </div>
      `).join('');
    };

    ['dragenter', 'dragover'].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.add('is-dragging');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.remove('is-dragging');
      });
    });

    dropzone.addEventListener('drop', (event) => {
      input.files = event.dataTransfer.files;
      render();
    });

    input.addEventListener('change', render);
  }

  function selectedOptions(selector) {
    return Array.from(document.querySelectorAll(`${selector}:checked`)).map((input) => ({
      id: input.value,
      name: input.dataset.sizeName || input.dataset.colorName,
      hex: input.dataset.colorHex
    }));
  }

  function readExisting(matrix) {
    try {
      return JSON.parse(matrix.dataset.existingVariations || '[]');
    } catch (error) {
      return [];
    }
  }

  function existingFor(existing, sizeId, colorId) {
    return existing.find((variation) => String(variation.sizeId || '') === String(sizeId || '') && String(variation.colorId || '') === String(colorId || ''));
  }

  function slugPart(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toUpperCase();
  }

  function rowTemplate({ size, color, existing, index }) {
    const sku = existing?.sku || [color?.name, size?.name].filter(Boolean).map(slugPart).join('-');
    const price = existing?.price || '';
    const stock = existing?.stock ?? '';
    const imageUrl = existing?.imageUrl || '';
    return `
      <div class="variation-matrix-row">
        <input type="hidden" name="variationSizeId" value="${size?.id || ''}">
        <input type="hidden" name="variationColorId" value="${color?.id || ''}">
        <input type="hidden" name="variationImageUrl" value="${imageUrl}">
        <div><strong>${color?.name || 'Sem cor'} ${size?.name || 'Sem tamanho'}</strong><small>${imageUrl ? 'Imagem cadastrada' : 'Sem imagem especifica'}</small></div>
        <label>SKU<input class="form-control" name="variationSku" value="${sku}"></label>
        <label>Preco<input class="form-control" name="variationPrice" value="${price}"></label>
        <label>Estoque<input class="form-control" name="variationStock" value="${stock}"></label>
        <label class="mini-upload">Imagem<input class="form-control" type="file" name="variationImage_${index}" accept="image/*"></label>
      </div>
    `;
  }

  function generateVariations() {
    const matrix = document.querySelector('[data-variation-matrix]');
    if (!matrix) return;

    const existing = readExisting(matrix);
    const sizes = selectedOptions('[name="selectedSizeIds"]');
    const colors = selectedOptions('[name="selectedColorIds"]');
    const sizeList = sizes.length ? sizes : [null];
    const colorList = colors.length ? colors : [null];
    const rows = [];

    colorList.forEach((color) => {
      sizeList.forEach((size) => {
        const current = existingFor(existing, size?.id, color?.id);
        rows.push({ size, color, existing: current, index: rows.length });
      });
    });

    matrix.innerHTML = rows.length
      ? rows.map(rowTemplate).join('')
      : '<div class="notice-empty">Selecione pelo menos um tamanho ou uma cor para gerar variacoes.</div>';

    const count = document.querySelector('[data-variation-count]');
    if (count) count.textContent = `${rows.length} variacao(oes)`;
  }

  document.querySelectorAll('[data-dropzone]').forEach(setupDropzone);

  const generateButton = document.querySelector('[data-generate-variations]');
  if (generateButton) {
    generateButton.addEventListener('click', generateVariations);
    document.querySelectorAll('[name="selectedSizeIds"], [name="selectedColorIds"]').forEach((input) => {
      input.addEventListener('change', generateVariations);
    });
    generateVariations();
  }
})();
