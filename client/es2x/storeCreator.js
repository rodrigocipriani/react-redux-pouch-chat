import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
// import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import PouchDB from 'pouchdb';
import { persistentStore } from 'redux-pouchdb';

const dbname = 'condominio';

/**
 * Lets you dispatch special actions with a { promise } field.
 *
 * This middleware will turn them into a single action at the beginning,
 * and a single success (or failure) action when the `promise` resolves.
 *
 * For convenience, `dispatch` will return the promise so the caller can wait.
 */
const readyStatePromise = store => next => (action) => {
  console.log(':::', action);
  if (!action.promise) {
    return next(action);
  }

  function makeAction(ready, data) {
    const newAction = Object.assign({}, action, { ready }, data);
    delete newAction.promise;
    return newAction;
  }

  next(makeAction(false));
  return action.promise.then(
    result => next(makeAction(true, { result })),
    error => next(makeAction(true, { error })),
  );
};

/**
 * Lets you dispatch promises in addition to actions.
 * If the promise is resolved, its result will be dispatched as an action.
 * The promise is returned from `dispatch` so the caller may handle rejection.
 */
const vanillaPromise = store => next => (action) => {
  if (typeof action.then !== 'function') {
    return next(action);
  }

  return Promise.resolve(action).then(store.dispatch);
};

const db = new PouchDB(dbname);
// 'https://couchdb.cloudno.de/condominio'
const sync = PouchDB.sync(
  dbname, 'https://rodrigocipriani:LQP1wqj9PQ@couchdb.cloudno.de/condominio',
  // dbname, 'https://couchdb.cloudno.de/condominio',
  {
    live: true,
    retry: true,
  }).on('change', (info) => {
    // handle change
    console.log('change', info);
  }).on('paused', (err) => {
    // replication paused (e.g. replication up to date, user went offline)
    console.log('paused', err);
  }).on('active', () => {
    // replicate resumed (e.g. new changes replicating, user went back online)
    console.log('active');
  }).on('denied', (err) => {
    // a document failed to replicate (e.g. due to permissions)
    console.log('denied', err);
  }).on('complete', (info) => {
    // handle complete
    console.log('complete', info);
  }).on('error', (err) => {
    // handle error
    console.log('error', err);
  });

const storeCreator = (reducers, props) => {
  const { isProduction, showLoggers } = props;
  let { loggerOptions } = props;
  const reducersObj = combineReducers(reducers);
  if (showLoggers !== undefined) {
    loggerOptions = { ...loggerOptions, predicate: () => showLoggers };
  }
  const loggerMiddleware = createLogger(loggerOptions);

  const persistentStoreObject = persistentStore(db, (data) => {
    console.log('data', data);
  });

  const store = isProduction ?
    createStore(
      reducersObj,
      compose(
        applyMiddleware(
          // thunkMiddleware,
          readyStatePromise,
          // vanillaPromise,
        ),
        persistentStoreObject,
      ),
    )
  : createStore(
      reducersObj,
      compose(
        applyMiddleware(
          // thunkMiddleware,
          readyStatePromise,
          // vanillaPromise,
          loggerMiddleware,
        ),
        persistentStoreObject,
        window.devToolsExtension ? window.devToolsExtension() : f => f,
      ),
    );

  // https://github.com/reactjs/react-redux/releases/tag/v2.0.0
  // Hot reloading reducers is now explicit (#80)
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(reducersObj, () => {
      store.replaceReducer(reducersObj);
    });
  }

  return store;
};

export default storeCreator;
