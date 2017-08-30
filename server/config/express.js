/**
 * Evite alterar este arquivo
 * */

const config = require('./config');

const express = require('express');
const path = require('path');
const cors = require('cors');
const redis = require('redis');
const consign = require('consign');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const modRewrite = require('connect-modrewrite');
const redisStore = require('connect-redis')(session);
const passport = require('passport');

module.exports = () => {
  const app = express();
  const port = process.env.PORT || config.port;

    /**
     * Configurações gerais
     * */
  app.set('port', port);

  /**
   * Reescrevendo a url para sempre cair no index.html
   * (correção refresh da tela)
   * */
  app.use(modRewrite(
        ['!\\api/|\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.woff|\\.woff2|\\.ttf$ /index.html [L]']
    ));

    /**
     * servir a aplicação no frontend
     * */
  app.use(express.static(config.publicFolder));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(require('method-override')());

  app.use(cookieParser(config.secretCookie));

    /**
     * Configuração para cross domain
     * */
  app.use(cors({
    origin     : config.corsOriginsAccept,
     // allowedHeaders: ['Content-Type', 'Authorization'],
     //  additionalHeaders: ['cache-control', 'x-requested-with'],
    credentials: true
  }));

    /**
     * Configuração do redis
     * */
  const configuracaoRedis = config.redis;
  configuracaoRedis.client = redis.createClient(config.redis.port, config.redis.host, {
    auth_pass     : config.redis.pass,
    no_ready_check: true
  });
  app.use(session(
    {
      secret           : config.secretSession,
      store            : new redisStore(configuracaoRedis),
      resave           : false,
      saveUninitialized: false
    }
    ));

    /**
     * Inicialização do passport
     * */
  app.use(passport.initialize());
  app.use(passport.session());

    /**
     * Carga de módulos
     * */
  consign({
    cwd: path.join(__dirname, '..', 'app')
    // cwd: path.join('server', 'app')
  })
        .include(path.join('models', 'modelo.js'))
        .then('util')
        .then('services')
        .then('controllers')
        .then('passport')
        .then('routes')
        .into(app);

  app.get('*', (req, res) => {
    res.status(404).render('404.ejs');
  });


    /*

    Carga dos modulos

     consign({
     //cwd: 'app',
     cwd: path.join(process.cwd(),'backend','app'),
     logger: console,
     verbose: true
     })
     .include('models.js')
     // .then('common')
     // .then('services')
     // .then('controllers')
     // .then('routes')
     .into(app);

     const carregarModulos = (dir, fileList = [], pai, busca) => {
     fs.readdirSync(dir).forEach(file => {
     const filePath = path.join(dir, file);
     if (fs.statSync(filePath).isDirectory()) {
     carregarModulos(filePath, fileList, pai, busca)
     } else {
     if (filePath.indexOf(busca) >= 0) {
     console.log("file", file);
     let modulo = require(filePath)(app);
     let name = path.basename(filePath).split('.')[0];
     pai[name] = modulo;
     console.log('Carregado:', name);
     }
     }
     });
     return fileList
     };

     let appDir = path.join(serverDir, 'app');
     app.services = {};
     app.controllers = {};
     app.routes = {};
     app.common = {};
     app.util = {};
     carregarModulos(appDir, [], app.common, 'common.js');
     carregarModulos(appDir, [], app.services, 'Service.js');
     carregarModulos(appDir, [], app.controllers, 'Controller.js');
     carregarModulos(__dirname+'/../node_modules/bb-common/modulos', [], app.util, 'Util.js');
     carregarModulos(__dirname+'/../node_modules/bb-common/modulos', [], app.services, 'Service.js');
     carregarModulos(__dirname+'/../node_modules/bb-common/modulos', [], app.controllers,  'Controller.js');
     app.use(app.controllers.autenticadorController.FiltroAutenticacao);
     carregarModulos(appDir, [], app.routes, 'Route.js');
     */


    /**
     * Tratamento de erros
     * */
  app.use((erro, req, res, next) => {
    console.log(erro.stack);
        // res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (res.headersSent) {
      return next(erro);
    }
    res.status(500);
    if (erro.chave) {
      res.send({ messages: [{ type: 'danger', chave: erro.chave }] });
    } else {
      res.send({ messages: [{ type: 'danger', text: erro.message }] });
    }
  });

  return app;
};

