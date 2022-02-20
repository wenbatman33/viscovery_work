import R from 'ramda';

import * as types from '../actions/types';

const initialState = {
  tags: [],
  brandBrief: [],
  isFinish: false,
  isLabel: false,
};

const tagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVE_TAGS:
      return {
        ...state,
        tags: action.tags,
        isFinish: action.tags.filter(tag => R.path(['result', 'status'])(tag) === 0).length === 0,
        isLabel: action.tags.filter(tag => R.path(['result', 'status'])(tag) === 4).length !== 0,
      };
    case types.RECEIVE_BRAND_BRIEF:
      return {
        ...state,
        brandBrief: action.brandBrief,
      };
    case types.UPDATE_TAGS: {
      const newTags = state.tags.map((tag) => {
        if (tag.id && action.updateList.includes(tag.id)) {
          return {
            ...tag,
            result: action.tagsDict[tag.id].result,
          };
        }
        return tag;
      });
      return {
        ...state,
        tags: newTags,
        isFinish: newTags.filter(tag => R.path(['result', 'status'])(tag) === 0).length === 0,
        isLabel: newTags.filter(tag => R.path(['result', 'status'])(tag) === 4).length !== 0,
        brandBrief: state.brandBrief.map((brand) => {
          if (brand.id === action.brandId) {
            return {
              ...brand,
              undone: newTags.map(tag => tag.result.status).filter(status => status === 0).length,
            };
          }
          return brand;
        }),
      };
    }
    default:
      return state;
  }
};

export default tagsReducer;
