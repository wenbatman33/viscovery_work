import * as types from './types';

const initialState = {
  message: [],
  response_code: [],
  tasks: [],
  tasks_total_count: 0,
  tasks_filter_count: 0,
  update_time: '',
  version: process.env.VERSION_NUMBER,
};


export default function system(state = initialState, action) {
  switch (action.type) {

    case types.RECIEVE_RECOGNITION_TASKS: {
      return {
        ...initialState,
        ...action.payload,
      };
    }
    case types.ADJUST_RECOGNITION_TASKS: {
      return {
        ...initialState,
        failure_tasks: action.payload.failure_tasks,
        success_count: action.payload.success_count,
        response_code: action.payload.response_code,
        failure_count: action.payload.failure_count,
      };
    }
    default: {
      return state;
    }
  }
}
