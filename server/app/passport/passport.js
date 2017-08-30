module.exports = (app) => {
  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;
  const uuid = require('node-uuid');
  const UsuarioService = app.services.usuarioService;
  const bcrypt = require(process.env.NODE_ENV == 'DESENVOLVIMENTO' ? 'bcryptjs' : 'bcrypt');

    /**
     * estratégia local - login
     * */
  passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    usernameField    : 'email',
    passwordField    : 'password'
  },
        (req, username, password, done) => {
          console.log('logar como ', username);
          UsuarioService.obterUsuarioPorEmail(username)
                .then((usuario) => {
                  if (!usuario) {
                    console.log('Usuário inexistente: ', username);
                    return done(null, false, { chave: 'mensagem.usuarioInexistente' });
                  } else if (usuario.situacao != 1) { // 1 confirmado, 0 - pendente
                    console.log('Confirmar usuário: ', username);
                    return done(null, false, { chave: 'Confirmar seu endereço de e-mail' });
                  }
                    // Validar senha
                  else if (!bcrypt.compareSync(password, usuario.senha)) {
                    console.error('senha invalida!');
                    return done(null, false, { chave: 'mensagem.senhaInvalida' });
                  }
                    // Tanto usuario e senha estão corretos, retorna usuario através
                    // do metodo done, e, agora, será considerado um sucesso
                    // limpa senha
                  usuario.senha = '';
                  return done(null, usuario);
                }).catch((erro) => {
                  console.log('erro:', erro);
                  return done(erro);
                });
        }))

    /**
     * estratégia local - cadastrar
     * */
        .use('cadastrar', new LocalStrategy({ passReqToCallback: true }, // permite retornar a requisição no callback
            (req, username, password, done) => {
              const { email } = req.body;

              const findOrCreateUser = () => {
                    // procura usuario no postgre
                UsuarioService.buscarOuCriar(email, username, password).then((usuario) => {
                        // retorna usuario criado
                  return done(null, usuario);
                }).catch((erro) => {
                  console.log('passport - cadastro - erro: ', erro);
                  return done(null, false, erro);
                });
              };
                // Delay the execution of findOrCreateUser and execute the method
                // in the next tick of the event loop
              process.nextTick(findOrCreateUser);
            })
        );

  passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
  });

  passport.deserializeUser((id, done) => {
    UsuarioService
            .obterUsuarioPorId(id)
            .then((usuario) => {
              console.log('deserialize usuario - nome=%s', usuario.nome);
              if (!usuario) {
                done({ chave: 'menssagem.usuarioInexistente' });
              } else {
                done(null, usuario);
              }
            })
            .catch((erro) => {
              console.log('erro: ', erro);
              done(erro);
            });
  });
};
