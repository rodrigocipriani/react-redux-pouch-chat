const jwt = require('jsonwebtoken');
const config = require('./../../config/config');


/**
 *  The Auth Checker middleware function.
 */
module.exports = (app) => {
    // console.log('&&&&&&&&&&&&&&', app);

  const UsuarioService = app.services.usuario;

  return (req, res, next) => {
        // console.log('req', req, res, next);
        // console.log('req.headers', req.headers);

    if (!req.headers.authorization) {
      return res.status(401).end('Não foi encontrado token de autenticação');
    }
        // console.log('req.headers222', req.headers.authorization);

        // get the last part from a authorization header string like "bearer token-value"
        // console.log('req.headers.authorization', req.headers.authorization);
    const token = req.headers.authorization.split(' ')[1];
        // console.log('token', token);

        // decode the token using a secret key-phrase
    return jwt.verify(token, config.secretSession, (err, decoded) => {
            // the 401 code is for unauthorized status
      if (err) {
        return res.status(401).end('Falha ao decodificar token');
      }

      console.log(decoded);
      let email = null;
      if (decoded) {
        email = decoded.email;
      } else {
        return res.status(401).end('Falha ao buscar dados no token');
      }
            /*
             // check if a user exists
             return User.findById(userId, (userErr, user) => {
             if (userErr || !user) {
             return res.status(401).end();
             }

             return next();
             });
             */
      UsuarioService.obterUsuarioPorEmail(email).then((usuario) => {
        console.log('usuario', usuario);
                /*
                 if (!usuario) {
                 console.log('Usuário inexistente: ', username);
                 return done(null, false, {chave: 'mensagem.usuarioInexistente'});
                 } else if (usuario.situacao != 1) { // 1 confirmado, 0 - pendente
                 console.log('Confirmar usuário: ', username);
                 return done(null, false, {chave: 'mensagem.mensagemEmailConfirmacao'});
                 }
                 //Validar senha
                 else if (!bcrypt.compareSync(password, usuario.senha)) {
                 console.error('senha invalida!');
                 return done(null, false, {chave: 'mensagem.senhaInvalida'});
                 }
                 */
        if (!usuario ||
                    (usuario && usuario.situacao != 1)) {
          return res.status(401).end('Falha ao validar usuário');
        }

        return next();
      }).catch((erro) => {
        console.log('erro:', erro);
                // return done(erro);
        return res.status(401).end(erro);
      });
    });
  };
};
