import 'babel-polyfill';
import Vue from 'vue';
import reduxStorePlugin from '../es2x/vue-redux-connect/reduxStorePlugin';
import store from './store';
import 'normalize.css';
import './main.css';
import App from './App/App.vue';


Vue.use(reduxStorePlugin);

/* eslint-disable no-new */
new Vue({
  el: '#app-vue',
  // router,
  store,
  render: h => (
      <App/>
  ),
});

store.subscribe(() => {
  // console.log('store.getState()', store.getState());
  // const total = store.getState().appReducer.total;
});
