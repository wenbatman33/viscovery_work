import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import ReportApp from '../../components/ReportApp';

import {
  getGroupbyReports,
  getAllShifts,
  getAllShiftMap,
  getAllUsers,
} from '../../actions';

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = dispatch => ({
  getAllShifts: () => dispatch(getAllShifts()),
  getGroupbyReports: (since, to) => dispatch(getGroupbyReports(since, to)),
  getAllShiftMap: () => dispatch(getAllShiftMap()),
  getAllUsers: () => dispatch(getAllUsers()),
});

const ReportAppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportApp);

export default ReportAppContainer;
