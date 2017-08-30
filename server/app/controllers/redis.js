// todo : onde está usando este modulo?
module.exports = function (app) {
  const config = require('../../config/config');
  const redis = require('redis');
  const cliente = redis.createClient(config.redis.port, config.redis.host, {
    auth_pass     : config.redis.pass,
    no_ready_check: true
  });

  const controller = {};
  controller.recuperarDados = function (req, res, next) {
    cliente.get(req.user._id + req.params.id, (erro, dados) => {
      if (erro) {
        return res.status(500).send('Erro ao recuperar dados', erro);
      }

      req.memoria = JSON.parse(dados);

      return next();
    });
  };

  controller.gravarDados = function (req, res) {
    cliente.set(req.user._id + req.params.id, JSON.stringify(req.memoria), (erro, dados) => {
      if (erro) {
        console.log('erro redis', erro);
        return res.status(500).send('Erro ao gravar dados', erro);
      }
      console.log('gravei redis', dados);
      return res;
    });
  };

  return controller;
};
