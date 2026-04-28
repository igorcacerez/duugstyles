module.exports = (err, req, res, _next) => {
  console.error(err);
  res.status(500).render('errors/500', { title: 'Erro interno', error: err.message });
};
