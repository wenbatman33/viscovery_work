/**
 * Created by amdis on 2017/3/24.
 */
import { translate } from 'react-i18next';
import { NAME } from './constants';

const BASE_URL = process.env.VDS_HOST;

export const localize = (component, moduleKey) => {
  if (!component || !moduleKey) {
    throw new Error('localize() error, missing arguments');
  }
  return translate([NAME])(component);
};

export const downloadHook = (url, fileName) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
};

export const addHostPrefix = (relativePath) => {
  if (!relativePath) return '';

  if (relativePath.substring(0, 1) === '/') return BASE_URL + relativePath;

  return `${BASE_URL}/${relativePath}`;
};
