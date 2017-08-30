

const config = require('../../config/config');
const nodemailer = require('nodemailer');
const cron = require('cron');
const EmailAddressRequiredError = new Error('Erro ao enviar email:');
const defaultTransport = nodemailer.createTransport({
  service: 'gmail',
  auth   : {
    user: config.mailer.auth.user,
    pass: config.mailer.auth.pass
  }

});

const utilitarios = {};
/* FUNÇÕES PUBLICAS */


/* FUNÇÕES INTERNAS */
/**
 *
 * @param data
 * @param fn
 */
const agendar = (data, fn) => {
  console.log('agendar data ', data);

  const CronJob = require('cron').CronJob;
  const job = new CronJob(data,
        () => {
            /* roda na data especificada. */
          console.log('job iniciou em ', new Date());
          fn();
        }, () => {
          console.log('job parou em ', new Date());
            /* executa quando o job termina- nao consegui testar*/
        },
        true /* inicia agora */
        // timeZone /* opcional */
    );
};

/**
 *
 * @param email
 * @param token
 */
const enviarEmailCadastro = (email, token) => {
  const url = `${ config.servidor }/#/confirmar/${ token }`;
  const templateHtml =
        `${ '<p>Novo usuario cadastrado com sucesso!</p>' +
        '<br>' +
        'Efetue a confirmação no link abaixo: ' +
        "<a target=\"_blank\" title=\"Confirmar cadastro\" alt=\"Confirmar cadastro\" href=\'" }${ url }'\>${ url }</a>`;
  enviarEmail(email, 'Novo usuario', templateHtml,
        (err, responseStatus) => {
          console.log('envio de email cadastro: ', responseStatus);
            // --> Callback não faz nada - caso o usuário não receba o email, deve haver uma maneira de gerar um novo.
        });
};

/**
 *
 * @param email
 * @param nome
 * @param token
 */
const enviarEmailAlterarSenha = (email, nome, token) => {
  const url = `${ config.servidor }/#/usuario-alterar-senha/${ token }`;
  const templateHtml =
        `<p>Olá <b>${ nome }</b>, </p>` +
        '<br> ' +
        'Altere sua senha clicando no link abaixo:' +
        '<br>' +
        `<a href=\'${ url }\' target='_blank\'  title='Alterar senha' alt='Alterar senha' \>${ url }</a>`;

  enviarEmail(email, 'Alterar senha', templateHtml,
        (err, responseStatus) => {
          console.log('envio de email alterar senha: ', responseStatus);
            // --> Callback não faz nada - caso o usuário não receba o email, deve haver uma maneira de gerar um novo.
        });
};

/**
 *
 * @param email
 * @param nomeJogo
 * @param nomeJogador
 */
const enviarEmailSuaVez = (email, nomeJogo, nomeJogador) => {
  const templateHtml = `<p>Olá ${ nomeJogador }, chegou sua vez no jogo <strong>${ nomeJogo }</strong></p>`;
  enviarEmail(email, 'Chegou sua vez', templateHtml,
        (err, responseStatus) => {
          console.log('envio de email sua vez: ', responseStatus);
        });
};

/**
 *
 * @param enderecos
 * @param assunto
 * @param mensagem
 * @param fn
 * @returns {*}
 */
const enviarEmail = (enderecos, assunto, mensagem, fn) => {
    // make sure that we have an user email
  if (!enderecos) {
    return fn(`${ EmailAddressRequiredError } endereço inválido`);
  }
    // make sure that we have a message
  if (!mensagem) {
    return fn(`${ EmailAddressRequiredError } mensagem inválida`);
  }

  if (!assunto) {
    return fn(`${ EmailAddressRequiredError } assunto inválido`);
  }

  defaultTransport.sendMail({
    from   : config.mailer.defaultFromAddress,
    to     : enderecos,
    subject: assunto,
    html   : mensagem
  }, (err, responseStatus) => {
    if (err) {
            // ignora erro
      return fn(null, err);
    }
    return fn(null, responseStatus);
  });
};

/**
 *
 * @param msg
 */
const getMensagemErro = (msg) => {
  return getMensagem('danger', msg);
};

/**
 *
 * @param msg
 */
const getMensagemInfo = (msg) => {
  return getMensagem('info', msg);
};

/**
 *
 * @param msg
 */
const getMensagemWarning = (msg) => {
  return getMensagem('warning', msg);
};

/**
 *
 * @param msg
 */
const getMensagemSucesso = (msg) => {
  return getMensagem('success', msg);
};

/**
 *
 * @param tipo
 * @param msg
 */
const getMensagem = (type, msg) => {
  console.log('getMensagem(%s, %s)', type, JSON.stringify(msg));
  const mensagem = { type };
  if (msg.chave) {
    mensagem.text = msg.chave;
  } else if (msg.message) {
    mensagem.text = msg.message;
  } else if (msg.text) {
    mensagem.text = msg.text;
  } else {
    mensagem.text = msg;
  }
  return { message: mensagem };
};


exports.agendar = agendar;
exports.enviarEmail = enviarEmail;
exports.enviarEmailAlterarSenha = enviarEmailAlterarSenha;
exports.enviarEmailCadastro = enviarEmailCadastro;
exports.enviarEmailSuaVez = enviarEmailSuaVez;
exports.getMensagemErro = getMensagemErro;
exports.getMensagemInfo = getMensagemInfo;
exports.getMensagemSucesso = getMensagemSucesso;
exports.getMensagemWarning = getMensagemWarning;
