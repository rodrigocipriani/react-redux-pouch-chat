import api from '../../es2x/api';
import config from '../../config';
import { appActionTypes } from './appActionTypes';

const appApi = api(config.urls.api);


export const add = total => ({
  type: appActionTypes.ADD,
  payload: total,
});

export const reset = () => ({
  type: appActionTypes.RESET_TOTAL,
  promise: appApi.get('/reset'),
});

export const criarListaServer = tamanho => ({
  type: appActionTypes.CRIAR_LISTA_SERVER,
  promise: appApi.get(`/criarlista/server/${tamanho}`),
});

export const criarListaClassic = tamanho => ({
  type: appActionTypes.CRIAR_LISTA_CLASSIC,
  promise: appApi.get(`/criarlista/classic/${tamanho}`),
});

export const criarListaClient = () => ({
  type: appActionTypes.CRIAR_LISTA_CLIENT,
});
