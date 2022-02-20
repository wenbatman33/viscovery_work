import * as types from '../actions/types';

const initialState = {
  workNav: true,
  unitStack: [],
  currentModelId: '',
  currentBrandId: '',
  currentVideoId: '',
};

const liliCocoReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TOGGLE_WORK_NAV:
      return {
        ...state,
        workNav: !state.workNav,
      };
    case types.TOGGLE_WORK_NAV_TO_SHOW:
      return {
        ...state,
        workNav: true,
      };
    case types.TOGGLE_WORK_NAV_TO_HIDE:
      return {
        ...state,
        workNav: false,
      };
    case types.RECEIVE_UNIT_STACK:
      return {
        ...state,
        unitStack: action.unitStack,
      };
    case types.CLEAR_UNIT_STACK:
      return {
        ...state,
        unitStack: [],
      };
    case types.RECEIVE_CURRENT_LOOKUP_ID:
      return {
        ...state,
        currentModelId: action.modelId,
        currentBrandId: action.brandId,
        currentVideoId: action.videoId,
      };
    case types.RECEIVE_CURRENT_VIDEO_ID:
      return {
        ...state,
        currentVideoId: action.videoId,
      };
    case types.RECEIVE_CURRENT_MODEL_ID:
      return {
        ...state,
        currentModelId: action.modelId,
      };
    case types.RECEIVE_CURRENT_BRAND_ID:
      return {
        ...state,
        currentBrandId: action.brandId,
      };
    default:
      return state;
  }
};

export default liliCocoReducer;
