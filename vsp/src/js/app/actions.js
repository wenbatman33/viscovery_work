import * as types from './types';

export const changeLocale = locale => ({
  type: types.CHANGE_LOCALE,
  locale,
});

export const restoreLocale = () => ({
  type: types.RESTORE_LOCALE,
});
