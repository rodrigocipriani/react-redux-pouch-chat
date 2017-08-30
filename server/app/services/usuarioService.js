module.exports = (app) => {
  const service = {};
  const UsuariosModel = app.models.modelo.usuariosModel;
  const CadastroModel = app.models.modelo.cadastrosModel;
  const sequelize = app.models.modelo.sequelize;
  const utilitarios = app.util.utilitarios;
  const bcrypt = require(process.env.NODE_ENV == 'DESENVOLVIMENTO' ? 'bcryptjs' : 'bcrypt');
  const INCLUIR_CADASTRO = 1;
  const ALTERAR_CADASTRO = 2;
  const SITUACAO_PENDENTE = 0;
  const PRAZO_EXPIRA = 1000 * 60 * 60 * 2;


  service.alterarSenhaComToken = (token, senha) => {
    console.log('usuarioService.alterarSenhaComToken - token=%s, senha=%s', token, senha);
    return sequelize.transaction({ autocommit: false }, (t) => {
      return CadastroModel
                .findOne(
        {
          where: { token }
        }
                ).then((cadastro) => {
                    // verifica se o usuario algum token
                  if (cadastro) {
                    console.log('cadastro.token %s , token=', cadastro.token, token);
                        // caso possua token, é necessário verificar se é do tipo 2 - alteração senha e se é igual ao da base
                    if (cadastro.tipo == ALTERAR_CADASTRO && token == cadastro.token) {
                      if (new Date() - cadastro.criacao > PRAZO_EXPIRA) {
                                // apagar token e depois rejeitar a promise
                        return CadastroModel.destroy({ where: { token } }).then((r) => {
                                    // se der certo, faz o commit do delete e rejeita a promise
                          t.commit();
                          return sequelize.Promise.reject({ chave: 'mensagem.tokenExpirado' });
                        });
                      }
                            // busca o usuario e altera a senha
                      return obterUsuarioPorId(cadastro.usuario_id);
                    }
                    return sequelize.Promise.reject({ chave: 'mensagem.tokenInvalido' });
                  }
                  return sequelize.Promise.reject({ chave: 'mensagem.tokenInexistente' });
                }).then((usuario) => {
                  console.log('--> recupera usuario: ', usuario.nome);
                    // valida senha
                  if (senha == undefined || senha.trim().length == 0) {
                    return sequelize.Promise.reject({ chave: 'mensagem.senhaInvalida' });
                  }
                    // altera a senha
                  return usuario.update(
                    {
                      senha: bcrypt.hashSync(senha, bcrypt.genSaltSync(10))
                    },
                        { where: { id: usuario.id } }
                    );
                }).then((ok) => {
                    // apaga o token
                  return CadastroModel.destroy({ where: { token } });
                });
    });
  };

    /**
     * Obtem lista de nomes dos usuários.
     * @param ids (array de ids)
     * @param cb (calback)
     * @returns usuarios {lista de usuarios}
     */
  const listarNomes = (ids, cb) => {
    UsuariosModel.findAll({
      attributes: ['nome'],
      where     : {
        id: {
          $in: ids
        }
      }
    }).then((usuarios) => {
      cb(null, usuarios);
    }).catch((erro) => {
      cb(erro);
    });
  };

    /**
     *
     * @param idUsuario
     * @returns {Query|Promise|*}
     */
  const obterUsuarioPorId = (idUsuario) => {
    return UsuariosModel
            .findOne({ attributes: ['id', 'nome', 'email', 'situacao', 'tipo'], where: { id: idUsuario } });
  };

    /**
     * Obtem  Usuario Por Email
     * @param email
     * @returns {Query|Promise|*}
     */
  const obterUsuarioPorEmail = (email) => {
    return UsuariosModel.findOne({
      where: { email }
    });
  };

    /**
     * Busca o usuario ou cria novo.
     * @param email
     * @param nome
     * @param senha {hashSenha}
     * @returns {*}
     */
  const buscarOuCriar = (email, nome, senha) => {
    console.log('email', email);
        // valida campos:
    if (email == undefined || email.trim().length == 0) {
      return sequelize.Promise.reject({ chave: 'E-mail inválido' });
    }

    if (nome == undefined || nome.trim().length == 0) {
      return sequelize.Promise.reject({ chave: 'Nome de usuário inválido' });
    }

    if (senha == undefined || senha.trim().length < 6) {
      return sequelize.Promise.reject({ chave: 'Senha de tamanho inválido' });
    }

    const campoEmail = email.toLowerCase();
    const hashSenha = bcrypt.hashSync(senha, bcrypt.genSaltSync(10));

    let usuarioPromise;
    return sequelize.transaction({ autocommit: false }, (t) => {
      return UsuariosModel
                .findOrCreate(
        {
          where   : { email: campoEmail },
          defaults: { nome, senha: hashSenha }
        }
                ).spread((usuario, criado) => {
                  usuarioPromise = usuario;

                    // Se o usuario foi criado, deve inserir registro na tabela Cadastro e retornar sua promise, caso contrário, undefined:
                  if (criado) {
                    return CadastroModel.create({ 'usuario_id': usuario.id, 'tipo': INCLUIR_CADASTRO });
                  }
                  return sequelize.Promise.reject({ chave: 'Usuário já existe' });
                }).then((cadastro) => {
                    // envia o email com o token recém criado
                    // TODO verificar se esse if é necessário
                  if (cadastro) {
                    utilitarios.enviarEmailCadastro(campoEmail, cadastro.token);
                        // Caso não tenha sido feito novo cadastro, significa que o usuário já existe,
                        // então deve retornar undefined. Senão, retornar usuarioPromise;
                        // todo Verificar se deve aparar a senha aqui
                    return usuarioPromise;
                  }
                    // caso contrário não retorna nada
                });
    });// --> se der erro, faz rollback
  };

    /**
     *
     * @param token
     */
  const validarTokenNovoUsuario = (token) => {
    return sequelize.transaction({ autocommit: false }, (t) => {
      return CadastroModel
                .find(
        {
          where  : { token },
          include: [{ model: UsuariosModel }]
        })
                .then((cadastro) => {
                  if (!cadastro) {
                    return sequelize.Promise.reject({ chave: 'mensagem.tokenInexistente' });
                  }

                  if (cadastro.usuario.situacao != 0) {
                    return sequelize.Promise.reject({ chave: 'mensagem.usuarioConfirmado' });
                  }

                  if (new Date() - cadastro.criacao > PRAZO_EXPIRA) {
                        // apagar token e depois rejeitar a promise
                    return CadastroModel.destroy({
                      where: { token }
                    }).then((r) => {
                            // se der certo, faz o commit do delete e rejeita a promise
                      t.commit();
                      return sequelize.Promise.reject({ chave: 'mensagem.tokenExpirado' });
                    });
                  }
                  cadastro.usuario.situacao = 1;
                  return cadastro.usuario.save();
                }).then((r) => {
                  return CadastroModel.destroy({ where: { token } });
                });
    });
  };

    /**
     * Alterar dados do usuario.
     * @param id
     * @param nome
     * @param senhaAntiga
     * @param senhaNova
     */
  const alterar = (id, nome, senhaAntiga, senhaNova) => {
    console.log('services/usuario - alterar ');

    return sequelize.transaction({ autocommit: false }, (t) => {
      return UsuariosModel.findOne({ where: { id } })
                .then((usuario) => {
                  console.log('services/usuario - alterar - usuario.nome: %s, usuario.senha: %s: ', usuario.nome, usuario.senha);
                  if (senhaNova == undefined || senhaNova.trim().length == 0 || !bcrypt.compareSync(senhaAntiga, usuario.senha)) {
                    console.error('senha invalida!');
                    return sequelize.Promise.reject({ chave: 'mensagem.senhaInvalida' });
                  }
                  return UsuariosModel.update(
                    {
                      nome,
                      senha: bcrypt.hashSync(senhaNova, bcrypt.genSaltSync(10))
                    },
                            { where: { id } }
                        );
                });
    });
  };

    /**
     * Solicita novo token para alteração de senha.
     * @param email
     * @returns {*}
     */
  const solicitarNovoToken = (email) => {
    console.log('usuarioService.solicitarNovoToken - ', email);
    let usuarioRecuperado;
    let tipoCadastro;
    return sequelize.transaction({ autocommit: false }, (t) => {
      return obterUsuarioPorEmail(email)
                .then((usuario) => {
                  if (!usuario) {
                    return sequelize.Promise.reject({ chave: 'mensagem.usuarioInexistente' });
                  }
                  usuarioRecuperado = usuario;
                  console.log('--> usuario: ', usuario);
                  tipoCadastro = usuario.situacao == SITUACAO_PENDENTE ? INCLUIR_CADASTRO : ALTERAR_CADASTRO;
                  return CadastroModel
                        .findOrCreate(
                    {
                      where   : { usuario_id: usuario.id },
                      defaults: { tipo: tipoCadastro }
                    }
                        );
                })
                .spread((cadastro, criado) => {
                  console.log('--> criado: %s, cadastro: %s', criado, cadastro);
                  if (!criado) {
                        // TODO apagar token e criar novo quando expirado
                    return sequelize.Promise.reject({ chave: 'mensagem.tokenPendente' });
                  }
                    // envia email de acordo com o tipo de cadastro:
                  if (tipoCadastro == INCLUIR_CADASTRO) {
                    utilitarios.enviarEmailCadastro(usuarioRecuperado.email, cadastro.token);
                  } else {
                    utilitarios.enviarEmailAlterarSenha(usuarioRecuperado.email, usuarioRecuperado.nome, cadastro.token);
                  }
                  return sequelize.Promise.resolve({ email: usuarioRecuperado.email });
                });
    });
  };

    // funções acesso externo
  service.alterar = alterar;
  service.listarNomes = listarNomes;
  service.buscarOuCriar = buscarOuCriar;
  service.obterUsuarioPorEmail = obterUsuarioPorEmail;
  service.obterUsuarioPorId = obterUsuarioPorId;
  service.solicitarNovoToken = solicitarNovoToken;
  service.validarTokenNovoUsuario = validarTokenNovoUsuario;


  return service;
};

