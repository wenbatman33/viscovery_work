import * as types from '../actions/types';

const initialState = {
  users: [],
  videos: [],
  tasks: [],
  onlineUserIds: [],
};

const hrsAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVE_ADMIN_USERS:
      return {
        ...state,
        users: action.users,
      };
    case types.RECEIVE_ADMIN_VIDEOS:
      return {
        ...state,
        videos: action.videos,
      };
    case types.RECEIVE_ADMIN_TASKS:
      return {
        ...state,
        tasks: action.tasks,
      };
    case types.RECEIVE_ONE_ADMIN_VIDEOS:
      return {
        ...state,
        videos: [
          ...state.videos.filter(video => video.id !== action.video.id),
          action.video,
        ],
      };
    case types.RECEIVE_ONE_ADMIN_TASKS:
      return {
        ...state,
        tasks: [
          ...state.tasks.filter(task => task.task_id !== action.task.task_id),
          action.task,
        ],
      };
    case types.RECEIVE_ONLINE_USER_IDS:
      return {
        ...state,
        onlineUserIds: action.onlineUserIds,
      };
    default:
      return state;
  }
};

export default hrsAdminReducer;
