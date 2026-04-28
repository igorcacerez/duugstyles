module.exports = {
  buildMeta({ title, description, canonical, image }) {
    return {
      title: title || 'Duug Styles | Moda Masculina Streetwear',
      description: description || 'Streetwear masculino premium com identidade urbana.',
      canonical,
      image: image || '/images/og-default.jpg'
    };
  }
};
