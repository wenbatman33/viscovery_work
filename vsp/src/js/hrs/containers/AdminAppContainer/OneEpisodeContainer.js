import { connect } from 'react-redux';
import R from 'ramda';

import OneEpisode from '../../components/AdminApp/OneEpisode';

import {
  updateOneTaskAssignee,
  updateManyTasksAssignee,
} from '../../actions';

import {
  getAdminVideos,
  getAdminTasks,
  getAdminUsers,
} from '../../selectors/hrsAdminSelector';

import {
  getBrands as getBrandsFromStructure,
} from '../../selectors/structureSelector';

const getUserId = state => R.path(['auth', 'user', 'uid'])(state);

const getLocale = state => state.lang.locale;

const mapStateToProps = (state, ownProps) => ({
  videoName: R.path(['video_name'])(getAdminVideos(state).find(video => video.id === Number(ownProps.match.params.videoId))),
  tasks: getAdminTasks(state).filter(
    task => task.video_id === Number(ownProps.match.params.videoId)),
  users: getAdminUsers(state),
  userId: getUserId(state),
  brandsFromStructure: getBrandsFromStructure(state),
  lang: getLocale(state),
});

const mapDispatchToProps = dispatch => ({
  updateOneTaskAssignee: (taskId, assignerId, assigneeId) =>
    dispatch(updateOneTaskAssignee(taskId, assignerId, assigneeId)),
  updateManyTasksAssignee: (taskIds, assignerId, assigneeId) =>
    dispatch(updateManyTasksAssignee(taskIds, assignerId, assigneeId)),
});

const OneEpisodeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OneEpisode);

export default OneEpisodeContainer;
