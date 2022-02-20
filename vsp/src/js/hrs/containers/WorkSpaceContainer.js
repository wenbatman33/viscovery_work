import { connect } from 'react-redux';

import R from 'ramda';

import WorkSpace from '../components/WorkSpace';

import {
  getTags,
  getIsFinish,
  getIsLabel,
} from '../selectors/tagsSelector';

import {
  getVisibilityFilter,
} from '../selectors/visibilityFilterSelector';

import {
  getProcessId,
  getTaskId,
  getImageHost,
} from '../selectors/hrsJobSelector';

import {
  getWorkNav,
  getUnitStatck,
  getCurrentModelId,
  getCurrentBrandId,
  getCurrentVideoId,
} from '../selectors/liliCocoSelector';

import {
  requestTags,
  pushUnitStack,
  forcePatchUnitStack,
  submitTask,
  submitTaskButLogout,
  changeVisibilityFilter,
  getDispatchFlow,
  wrappedLogout,
} from '../actions';

const getUserId = state => R.path(['auth', 'user', 'uid'])(state);

const getTagsWithFilter = (filter, data) => {
  switch (filter) {
    case 'all':
      return data;
    case 'undone':
    case 'default':
      return data.filter(unit => unit.result.status === 0);
    case 'done':
      return data.filter(unit => unit.result.status !== 0 && unit.result.status !== 4);
    default:
      return data.filter(unit => unit.result.status === Number(filter));
  }
};

const mapStateToProps = (state, ownProps) => (
  {
    units: getTagsWithFilter(getVisibilityFilter(state), getTags(state)),
    isFinish: getIsFinish(state),
    isLabel: getIsLabel(state),
    workNavShow: getWorkNav(state),
    currentFilter: getVisibilityFilter(state),
    brandsRef: state.hrs.structureReducer.brandsForBrandEditorInUse,
    isUnitStackEmpty: getUnitStatck(state).length <= 0,
    currentModelId: R.path(['params', 'modelId'])(ownProps) || getCurrentModelId(state),
    currentBrandId: R.path(['params', 'brandId'])(ownProps) || getCurrentBrandId(state),
    currentVideoId: R.path(['params', 'videoId'])(ownProps) || getCurrentVideoId(state),
    processId: getProcessId(state),
    taskId: getTaskId(state),
    userId: getUserId(state),
    imageHost: getImageHost(state),
  }
);

const mapDispatchToProps = dispatch => ({
  requestTags: (...params) => {
    if (params.filter(e => e !== '').length === 0) return null;
    return dispatch(requestTags(...params));
  },
  updateResult: (userId, processId, currentVideoId, currentBrandId, tags) =>
    dispatch(pushUnitStack(userId, processId, currentVideoId, currentBrandId, tags)),
  forcePatchUnitStack: (userId, processId) =>
    dispatch(forcePatchUnitStack(userId, processId)),
  submitTask: (userId, taskId, processId, isLabel) =>
    dispatch(submitTask(userId, taskId, processId, isLabel)),
  submitTaskButLogout: (userId, taskId, processId, isLabel) =>
    dispatch(submitTaskButLogout(userId, taskId, processId, isLabel)),
  changeVisibilityFilterToDefault: () =>
    dispatch(changeVisibilityFilter('default')),
  getDispatch: userId =>
    dispatch(getDispatchFlow(userId)),
  wrappedLogout: (userId, processId) =>
    dispatch(wrappedLogout(userId, processId)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => (
  {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    submitTask: () =>
      dispatchProps.submitTask(
        stateProps.userId,
        stateProps.taskId,
        stateProps.processId,
        stateProps.isLabel ? 1 : 0
      ),
    submitTaskButLogout: () =>
      dispatchProps.submitTaskButLogout(
        stateProps.userId,
        stateProps.taskId,
        stateProps.processId,
        stateProps.isLabel ? 1 : 0
      ),
    updateResult: tags =>
      dispatchProps.updateResult(
        stateProps.userId,
       stateProps.processId,
       stateProps.currentVideoId,
       stateProps.currentBrandId,
       tags
      ),
    forcePatchUnitStack: () =>
      dispatchProps.forcePatchUnitStack(stateProps.userId, stateProps.processId),
    getDispatch: () =>
      dispatchProps.getDispatch(stateProps.userId),
    wrappedLogout: () =>
      dispatchProps.wrappedLogout(stateProps.userId, stateProps.processId),
  }
);

const WorkSpaceContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(WorkSpace);

export default WorkSpaceContainer;
