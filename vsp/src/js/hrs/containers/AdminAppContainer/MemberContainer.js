import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Member from '../../components/AdminApp/Member';

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
  getOnlineUserIds,
} from '../../selectors/hrsAdminSelector';

import {
  getBrands as getBrandsFromStructure,
} from '../../selectors/structureSelector';

const getLocale = state => state.lang.locale;

const mapStateToProps = createStructuredSelector({
  users: getAdminUsers,
  videos: getAdminVideos,
  tasks: getAdminTasks,
  onlineUserIds: getOnlineUserIds,
  brandsFromStructure: getBrandsFromStructure,
  lang: getLocale,
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

const MemberContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Member);

export default MemberContainer;
