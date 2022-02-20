import * as types from './types';

const initialState = {
  imageHost: null,
  videoHost: null,
};

const shared = (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVE_RESOURCE_CONFIG: {
      const { payload } = action;
      return Object.assign({}, state,
        {
          imageHost: payload.img_host,
          videoHost: payload.video_host,
        }
      );
    }
    default:
      return state;
  }
};

export default shared;
