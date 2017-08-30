const deepmerge = require('deepmerge');

const configCreator = (props) => {
  const { defaultConfig, development, test, production } = props;
  const env = { isDevelopment: false, isTest: false, isProduction: false };

  let retorno;
  const ambiente = process.env.NODE_ENV || '';

  switch (ambiente.toLowerCase()) {
  case 'test':
    env.isTest = true;
    retorno = test;
    break;
  case 'production':
    env.isProduction = true;
    retorno = production;
    break;
  default:
      // case 'DESENVOLVIMENTO':
    env.isDevelopment = true;
    retorno = development;
    break;
  }

  retorno.env = env;

  return deepmerge(defaultConfig, retorno);
};

module.exports = configCreator;
