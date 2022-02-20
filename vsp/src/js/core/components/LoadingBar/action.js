/**
 * Created by amdis on 2017/2/20.
 */

import * as types from './types';

export const showLoading = message => (
  {
    type: types.SHOW_LOADING,
    payload: message,
  }
);

export const hideLoading = () => (
  {
    type: types.HIDE_LOADING,
  }
);
