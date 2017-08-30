module.exports = (app) => {
  const passport        = require('passport');
  const config          = require('../../config/config');
  const Erro            = require('../util/Erro');
  const UsuariosService = app.services.usuarioService;
  const controller      = {};


  /**
   * Busca dados do usuário logado
   */
  controller.obterUsuarioLogado = (req, res) => {
    console.log('req.user >>>>', req.user);

    if (!req.user) {
      res.status(401).send(Erro.getMensagemErro({ chave: 'Usuário não autenticado. Efetuar login.' }));
    }
    res.json(req.user);
  };

  /**
   * Cadastrar novo usuário
   */
  controller.cadastrar = (req, res, next) => {
    console.log('req', req);
    const { username, email, password } = req.body;
    console.log('username, email, password', username, email, password);

    // TODO: fazer aparecer na validação do formulario
    const erros = [];
    if (username === '') {
      erros.push(Erro.getMensagemErro('Nome informado incorreto'));
    }
    if (email === '') {
      erros.push(Erro.getMensagemErro('E-mail informado incorreto'));
    }
    if (password === '') {
      erros.push(Erro.getMensagemErro('Senha informada incorreta'));
    }
    if (erros.length > 0) {
      return res.status(400).send(Erro.getMensagemErro('Conferir o preenchimento dos campos'));
    }

    passport.authenticate('cadastrar', (err, user, info) => {
      if (err) {
        return res.status(400).send(Erro.getMensagemErro(err));
      }
      if (!user) {
        return res.status(400).send(Erro.getMensagemErro(info));
      }
      req.logIn(user, (erro) => {
        console.log('erro >>>||', erro);
        if (erro) {
          return next(erro);
        }
        console.log('user >>>||', user);
        user.senha = '';
        return res.json(user);
        // return res.status(200).send(Erro.getMensagemSucesso({chave: 'mensagem.usuarioCriadoSucesso'}));
        // return res.send(Erro.getMensagemSucesso({chave: 'mensagem.usuarioCriadoSucesso'}));
      });
    })(req, res, next);
  };

  controller.alterar = (req, res) => {
    console.log('usuarioController.alterar - req.body', JSON.stringify(req.body));
    UsuariosService
      .alterar(req.body.id, req.body.nome, req.body.senhaAntiga, req.body.senha)
      .then((r) => {
        console.log('usuarioController.alterar - resposta: ', r);
        return res.json(Erro.getMensagemSucesso({ chave: 'mensagem.usuarioAlteradoSucesso' }));
      }).catch((erro) => {
        console.log('usuarioController.alterar - erro: ', erro);
        return res.status(400).send(Erro.getMensagemErro(erro));
      });
  };

  controller.solicitarNovoToken = (req, res, next) => {
    console.log('usuarioService.solicitarNovoToken ', req.body.email);
    return UsuariosService
      .solicitarNovoToken(req.body.email)
      .then((email) => {
        return res.status(200).send(email);
      })
      .catch((erro) => {
        console.log('--> erro: ', erro);
        return res.status(400).send(Erro.getMensagemErro(erro));
      });
  };

  /**
   * Altera a senha com o token recebido via email.
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  controller.alterarSenhaComToken = (req, res, next) => {
    console.log('usuarioService.alterarSenhaComToken() - token=%s, senha=%s', req.body.token, req.body.senha);
    return UsuariosService
      .alterarSenhaComToken(req.body.token, req.body.senha)
      .then((usuarioAlterado) => {
        console.log('não devolve nada quando dá certo: %s', JSON.stringify(usuarioAlterado));
        return res.status(200).send();
      })
      .catch((erro) => {
        // console.log('--> erro: ', erro);
        return res.status(400).send(Erro.getMensagemErro(erro)); // getMensagemErro(erro));
      });
  };

  controller.confirmarCadastro = (req, res) => {
    const token = req.params.token;
    console.log('usuarioService.confirmarCadastro - token: %s', token);
    UsuariosService
      .validarTokenNovoUsuario(token)
      .then((r) => {
        console.log('deu certo: ', JSON.stringify(r));
        return res.json(Erro.getMensagemSucesso({ chave: 'mensagem.usuarioConfirmadoSucesso' }));
      })
      .catch((erro) => {
        console.log('usuario.confirmar - erro: ', JSON.stringify(erro));
          // if(erro.chave){
          //    return res.json({message: [{type: 'danger', chave: erro.chave}]});
          // }
          // return res.json({message: [{type: 'danger', text: erro}]});
        return res.status(401).send(Erro.getMensagemErro(erro));
      }
      );
  };


  controller.logar = (req, res, next) => {
    const { email, password } = req.body;
    console.log('email, password', email, password);

    // TODO: fazer aparecer na validação do formulario
    const erros = [];
    if (email === '') {
      erros.push(Erro.getMensagemErro('E-mail informado incorreto'));
    }
    if (password === '') {
      erros.push(Erro.getMensagemErro('Senha informada incorreta'));
    }
    if (erros.length > 0) {
      return res.status(401).send(Erro.getMensagemErro('Usuário ou senha incorreto(s)'));
    }

    passport.authenticate('login', (erro, usuario, info) => {
      console.log(erro, usuario, info);
      if (erro || info) {
        return res.status(401).send(Erro.getMensagemErro(erro || info));
      }
      if (!usuario) {
        return res.status(401).send(Erro.getMensagemErro('Usuário não encontrado'));
      }

      req.logIn(usuario, (erro) => {
        if (erro) {
          return next(erro);
        }
        const payload = {
          email: usuario.email
        };
        return res.json(usuario);
      });
    })(req, res, next);
  };

  controller.sair = (req, res) => {
    req.session.destroy(() => {
      console.log('session destroyed.');
    });
    req.logOut();
    return res.json({ msg: 'ok' });
    // res.redirect('/');
  };

  return controller;
};
