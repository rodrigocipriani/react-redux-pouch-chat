import storeCreator from '../es2x/storeCreator';
import config from '../config';
import { persistentReducer } from 'redux-pouchdb';

console.log('config', config);

import { app } from './App/appReducer';
import { usuario } from './App/usuarioReducer';

const showLoggers = false;
const isProduction = config.env.isProduction;

export default storeCreator({
  appStore: persistentReducer(app),
  usuarioStore: persistentReducer(usuario),
}, { isProduction, showLoggers });
