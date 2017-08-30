import { appActionTypes } from './appActionTypes';

const initialState = {
  total: 0,
  teste: 1,
  biglist: [{ id: 0, nome: 'item 0' }],
};

const actionsMap = {

  [appActionTypes.ADD]: (state, action) => {
    const total = action.payload ? parseInt(action.payload, 0) : state.total + 1;
    return { ...state, total };
  },

  [appActionTypes.CRIAR_LISTA_CLIENT]: (state, action) => {
    console.log('biglist111');
    const biglist = [];
    for (let i = 0; i < state.total; i++) {
      biglist.push({
        id: i,
        nome: `item ${i}`,
      });
    }
    console.log('biglist', biglist);
    return { ...state, biglist };
  },

  [appActionTypes.CRIAR_LISTA_CLASSIC]: (state, action) => {
    console.log('*-*-*-*-*-*');
    console.log('action', action);
    console.log('state', state);
    if (action.ready) {
      const biglist = action.result.data;
      console.log('biglist', biglist);
      return { ...state, biglist };
    }
    return state;
  },

  [appActionTypes.RESET_TOTAL]: (state, action) => {
    console.log('------------------');
    console.log('action', action);
    console.log('state', state);
    return state;
  },

};

const app = (state = initialState, action = {}) => {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
};

export { app };
