import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import R from 'ramda';

import DispatchApp from '../components/DispatchApp';

import {
  getDispatchFlow,
  startProcess,
  toggleWorkNavToHide,
} from '../actions';

import {
  getTaskId,
} from '../selectors/hrsJobSelector';

const getUserId = state => R.path(['auth', 'user', 'uid'])(state);

const mapStateToProps = createStructuredSelector({
  userId: getUserId,
  taskId: getTaskId,
});

const mapDispatchToProps = dispatch => ({
  getDispatch: userId =>
    dispatch(getDispatchFlow(userId)),
  startProcess: (userId, taskId) =>
    dispatch(startProcess(userId, taskId)),
  toggleWorkNavToHide: () =>
    dispatch(toggleWorkNavToHide()),
});

const DispatchAppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DispatchApp);

export default DispatchAppContainer;
