import * as types from '../actions/types';

const initialState = {
  processId: 0,
  taskId: 0,
};

const hrsJobReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVE_TASK_ID:
      return {
        ...state,
        taskId: action.taskId,
      };
    case types.RECEIVE_PROCESS_ID:
      return {
        ...state,
        processId: action.processId,
      };
    default:
      return state;
  }
};

export default hrsJobReducer;
