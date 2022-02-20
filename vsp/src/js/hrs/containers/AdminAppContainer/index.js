import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import AdminApp from '../../components/AdminApp';

import {
  getAdminTasks,
  getAllUsers,
  getAllVideos,
  receiveOnlineUserIds,
  requestTagsMapping,
} from '../../actions';

import {
  getOnlineUserIds,
} from '../../selectors/hrsAdminSelector';

const mapStateToProps = createStructuredSelector({
  onlineUserIds: getOnlineUserIds,
});

const mapDispatchToProps = dispatch => ({
  getAdminTasks: () =>
    dispatch(getAdminTasks()),
  getAllUsers: () =>
    dispatch(getAllUsers()),
  getAllVideos: () =>
    dispatch(getAllVideos()),
  receiveOnlineUserIds: onlineUserIds =>
    dispatch(receiveOnlineUserIds(onlineUserIds)),
  requestTagsMapping: (lang) => {
    dispatch(requestTagsMapping(lang));
  },
});

const AdminAppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminApp);

export default AdminAppContainer;
