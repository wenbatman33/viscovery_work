import { connect } from 'react-redux';

import OneMember from '../../components/AdminApp/Member/OneMember';

import {
  updateOneTaskPriority,
  updateManyTasksPriority,
  releaseOneTaskFlow,
  releaseManyTasks,
} from '../../actions';

import {
  getAdminUsers,
  getAdminTasks,
  getAdminVideos,
} from '../../selectors/hrsAdminSelector';

const mapStateToProps = (state, ownProps) => ({
  users: getAdminUsers(state).filter(user => user.uid === Number(ownProps.match.params.uid)),
  videos: getAdminVideos(state),
  tasks: getAdminTasks(state),
});

const mapDispatchToProps = dispatch => ({
  updateOneTaskPriority: (taskId, priority) =>
    dispatch(updateOneTaskPriority(taskId, priority)),
  updateManyTasksPriority: (taskIds, priority) =>
    dispatch(updateManyTasksPriority(taskIds, priority)),
  releaseOneTask: taskId =>
    dispatch(releaseOneTaskFlow(taskId)),
  releaseManyTasks: taskIds =>
    dispatch(releaseManyTasks(taskIds)),
});

const OneMemberContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OneMember);

export default OneMemberContainer;
