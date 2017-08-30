/**
 * Created by thiago on 07/12/2015.
 */


module.exports = (app) => {
  const service             = {};
  const config              = require('../../config/config');
  const redis               = require('redis');
  const cliente = redis.createClient(config.redis.port, config.redis.host, {
    auth_pass     : config.redis.pass,
    no_ready_check: true
  });

    //  var cliente      ;


  service.gravarDados = (req, memoria, cb) => {
    console.log('stringificando ', JSON.stringify(memoria));

    cliente.set(req.user._id + req.params.id, JSON.stringify(memoria), (erro, dados) => {
      if (erro) {
        console.log('erro redis', erro);
        return cb(erro);
      }
      console.log('gravei redis', dados);
      cb(null);
    });
  };

  return service;
};
