import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import AssignTask from '../../components/AdminApp/common/AssignTask';

import {
  getAdminUsers,
} from '../../selectors/hrsAdminSelector';

const mapStateToProps = createStructuredSelector({
  users: getAdminUsers,
});

const mapDispatchToProps = () => ({
});

const AssignTaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssignTask);

export default AssignTaskContainer;
