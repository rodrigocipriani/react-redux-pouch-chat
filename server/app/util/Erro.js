/**
 *
 * @param tipo
 * @param msg
 */
const getMensagem = (type, msg) => {
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


exports.getMensagemErro = getMensagemErro;
exports.getMensagemInfo = getMensagemInfo;
exports.getMensagemSucesso = getMensagemSucesso;
exports.getMensagemWarning = getMensagemWarning;
