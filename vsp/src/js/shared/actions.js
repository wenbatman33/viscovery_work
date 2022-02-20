import * as types from './types';
import {
  configApi,
} from './api';

export const queryResourceConfig = () => (dispatch =>
  configApi.getResourceConfig()
    .then((res) => {
      const resource = res.resource;
      dispatch({
        type: types.RECEIVE_RESOURCE_CONFIG,
        payload: resource,
      });
    })
);
