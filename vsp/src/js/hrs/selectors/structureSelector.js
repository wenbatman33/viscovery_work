import { NAME } from '../constants';

export const getModels = state => state[NAME].structureReducer.models;
export const getClasses = state => state[NAME].structureReducer.classes;
export const getBrands = state => state[NAME].structureReducer.brands;
export const getEditorClasses = state => state[NAME].structureReducer.classesForBrandEditorInUse;
export const getEditorBrands = state => state[NAME].structureReducer.brandsForBrandEditorInUse;
