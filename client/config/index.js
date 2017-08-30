const configCreator = require('../es2x/configCreator');

const defaultConfig = require('./env/default');
const development = require('./env/development');
const test = require('./env/test');
const production = require('./env/production');

module.exports = configCreator({ defaultConfig, development, test, production });
