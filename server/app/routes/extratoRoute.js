
module.exports = (app) => {
  const extratoController = app.controllers.extratoController;
  const isLogged = require('../passport/isLogged');

  app.route('/api/extrato')
        // .all(isLogged(app)) // desta forma verifica o login
        .get(extratoController.findAll);

  app.route('/api/criarlista/server/:tamanho')
    .get(extratoController.criarlistaServer);

  app.route('/api/criarlista/classic/:tamanho')
        .get(extratoController.criarlistaClassic);

  app.route('/api/reset')
        .get(extratoController.reset);
};
