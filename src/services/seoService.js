const env = require('../config/env');

function absoluteUrl(path) {
  if (!path) return env.app.url;
  if (/^https?:\/\//i.test(path)) return path;
  return `${env.app.url}${path.startsWith('/') ? path : `/${path}`}`;
}

module.exports = {
  buildMeta({ title, description, canonical, image }) {
    return {
      title: title || 'Duug Styles | Moda Masculina Streetwear',
      description: description || 'Streetwear masculino premium com identidade urbana, camisetas oversized, moletons e ofertas exclusivas.',
      canonical: absoluteUrl(canonical),
      image: absoluteUrl(image || '/public/images/hero-streetwear-duug.png'),
      keywords: 'streetwear masculino, camisetas oversized, moletons masculinos, moda urbana, Duug Styles'
    };
  },
  absoluteUrl
};
