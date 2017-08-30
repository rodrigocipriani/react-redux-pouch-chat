module.exports = (app) => {
  app.get('/', (req, res) => {
    let nomeUsuario = '';
    let admin = false;
    if (req.user) {
      nomeUsuario = req.user.nome;
      admin = req.user.admin;
    }
    res.render('index', { 'usuarioLogado': nomeUsuario, 'admin': admin });
  });
};
