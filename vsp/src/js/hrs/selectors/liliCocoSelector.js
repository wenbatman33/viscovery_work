import { NAME } from '../constants';

export const getWorkNav = state => state[NAME].liliCocoReducer.workNav;
export const getUnitStatck = state => state[NAME].liliCocoReducer.unitStack;
export const getCurrentModelId = state => state[NAME].liliCocoReducer.currentModelId;
export const getCurrentBrandId = state => state[NAME].liliCocoReducer.currentBrandId;
export const getCurrentVideoId = state => state[NAME].liliCocoReducer.currentVideoId;
