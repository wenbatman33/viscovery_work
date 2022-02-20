/**
 * Created by amdis on 2017/2/20.
 */
import * as types from './types';

const initialState = {
  loadingBar: false,
  loadingMessage: null,
};

export default function loadingBarReducer(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_LOADING:
      return Object.assign({}, state, { loadingBar: true, loadingMessage: action.payload });

    case types.HIDE_LOADING:
      return Object.assign({}, state, { loadingBar: false, loadingMessage: null });
    default :
      return state;
  }
}
