module.exports = (app) => {
  const Erro = require('../util/Erro');

  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      // return res.redirect(401, '/logout');
      const message = Erro.getMensagemErro('Usuário não está autenticado');
      return res.status(401).send({
        message,
        authError: 'NOT_AUTHENTICATED'
      });
    }

    return next();
  };
};
