
module.exports = (app) => {
  const usuarioController = app.controllers.usuarioController;

  app.route('/api/autenticacao')
        .post(usuarioController.logar)
        .get(usuarioController.sair);
  app.route('/api/usuario')
        .post(usuarioController.cadastrar)
        .get(usuarioController.obterUsuarioLogado)
        .put(usuarioController.alterar);
  app.route('/api/usuario/cadastro/:token?')
        .get(usuarioController.confirmarCadastro)
        .post(usuarioController.solicitarNovoToken)
        .put(usuarioController.alterarSenhaComToken);
};
