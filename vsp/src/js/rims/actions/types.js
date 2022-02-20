import { NAME } from '../constants';

const prefix = `${NAME}/`;

const typeGenerator = type => `${prefix}${type}`;

export const CHANGE_PAGE = typeGenerator('CHANGE_PAGE');
export const SUBMIT_SEARCH_TEXT = typeGenerator('SUBMIT_SEARCH_TEXT');
export const RECEIVE_MODEL_DATA = typeGenerator('RECEIVE_MODEL_DATA');
export const UPLOAD_CSV_FAILED = typeGenerator('UPLOAD_CSV_FAILED');
export const CLEAR_CSV_UPLOAD_ILLEGAL = typeGenerator('CLEAR_CSV_UPLOAD_ILLEGAL');
export const SHOW_IMPORTING = typeGenerator('SHOW_IMPORTING');
export const HIDE_IMPORTING = typeGenerator('HIDE_IMPORTING');
export const SHOW_SUCCESS_BAR = typeGenerator('SHOW_SUCCESS_BAR');
export const HIDE_SUCCESS_BAR = typeGenerator('HIDE_SUCCESS_BAR');
export const CLEAR_DUP_BRANDS = typeGenerator('CLEAR_DUP_BRANDS');
export const OPEN_ADD_BRAND = typeGenerator('OPEN_ADD_BRAND');
export const CANCEL_ADD_BRAND = typeGenerator('CANCEL_ADD_BRAND');
export const ADD_BRAND_FAILED = typeGenerator('ADD_BRAND_FAILED');
export const CLEAR_ADD_FAILED_BRAND = typeGenerator('CLEAR_ADD_FAILED_BRAND');
export const SHOW_BRAND_SUCCESS_STYLE = typeGenerator('SHOW_BRAND_SUCCESS_STYLE');
export const HIDE_BRAND_SUCCESS_STYLE = typeGenerator('HIDE_BRAND_SUCCESS_STYLE');
export const EDIT_BRAND_FAILED = typeGenerator('EDIT_BRAND_FAILED');
export const CLEAR_EDIT_BRAND_FAILED_LIST = typeGenerator('CLEAR_EDIT_BRAND_FAILED_LIST');
