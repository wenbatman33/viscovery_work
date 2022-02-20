import { createSelector } from 'reselect';

import { NAME } from '../constants';

export const getTags = state => state[NAME].tagsReducer.tags;
export const getBrands = state => state[NAME].tagsReducer.brandBrief;
export const getIsFinish = state => state[NAME].tagsReducer.isFinish;
export const getIsLabel = state => state[NAME].tagsReducer.isLabel;
export const getVideoName = createSelector(
  getBrands,
  brands => (brands.length !== 0 ? brands[0].video.name : '')
);
export const getRemainCount = createSelector(
  getTags,
  tags => (tags.filter(tag => [0].includes(tag.result.status)).length)
);
