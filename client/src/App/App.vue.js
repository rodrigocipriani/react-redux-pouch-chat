// import { UiAlert, UiButton } from 'keen-ui';
import UiButton from 'keen-ui/lib/UiButton';
import connect from '../../es2x/vue-redux-connect/connect';
import { appActionTypes } from './appActionTypes';

const App = {
  data: () => ({
    isRed: true,
  }),
  components: {
    UiButton,
  },
  // methods: {
  //   add(event) {
  //     store.dispatch({ type: 'ADD' });
  //   },
  // },
  props: {
    total: {
      type: Number,
    },
    add: {
      type: Function,
    },
  },
  render(h) {
    return (
        <div class={{ 'is-red': this.isRed }}>
          <h2>Vue App</h2>
          <ui-button onClick={this.add} type="primary">Add from Vue</ui-button>
          <div>Total: {this.total}</div>
        </div>
    );
  },
};

function mapStateToProps(state) {
  return {
    total: state.appStore.total,
  };
}

function mapActionToProps(dispatch) {
  return {
    add() {
      dispatch({
        type: appActionTypes.ADD,
        // data: { 1 },
      });
    },
  };
}

export default connect(mapStateToProps, mapActionToProps)(App);
