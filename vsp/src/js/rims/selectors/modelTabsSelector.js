import { NAME } from '../constants';

export const getSearchObj = state => state[NAME].modelTabsReducer.searchObj;
export const getIsImporting = state => state[NAME].modelTabsReducer.showImporting;
export const getDuplicateBrands = state => state[NAME].modelTabsReducer.duplicateBrands;
export const checkIsCsvUploadIllegal = state => state[NAME].modelTabsReducer.isCsvUploadIllegal;
