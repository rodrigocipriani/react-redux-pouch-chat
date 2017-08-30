module.exports = (app) => {
  const verificadorController = {};

  verificadorController.isAutenticado = (req, res, next) => {
    console.log('verificador.isAutenticado ');

    if (req.isAuthenticated()) {
      return next();
    }
    return res.status('401').json({
      message: {
        tipo : 'danger',
        chave: 'mensagem.naoAutorizado'
      }
    });
  };

  verificadorController.isAdmin = (req, res, next) => {
    console.log('verificador.isAdmin ');
    if (req.isAuthenticated() && req.user.tipo === 99) {
      console.log('req.user ', JSON.stringify(req.user));
      return next();
    }
    console.log('req.user ', JSON.stringify(req.user));
    return res.status('403').json({
      message: {
        type : 'danger',
        chave: 'mensagem.naoAutorizado'
      }
    });
  };

  return verificadorController;
};
