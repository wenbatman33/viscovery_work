import { cookieUtil } from 'utils';
import * as types from './types';

const initialState = {
  locale: window.navigator.language.toLowerCase().replace('-', ''),
};

export default function lang(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_LOCALE: {
      cookieUtil.setLocale(action.locale);
      return Object.assign({}, state, {
        locale: action.locale,
      });
    }
    case types.RESTORE_LOCALE: {
      const locale = cookieUtil.getLocale() || state.locale;
      return Object.assign({}, state, {
        locale,
      });
    }
    default: {
      return state;
    }
  }
}
