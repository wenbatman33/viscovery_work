import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import SingleShiftOverview from '../../components/ReportApp/SingleShiftOverview';

import {
  getGroupbyReports,
  getShifts,
  getShiftMaps,
  getCache,
} from '../../selectors/hrsReportSelector';

import { getHrsMember } from '../../selectors/hrsAdminSelector';

import {
  setReportShiftCache,
} from '../../actions';

const mapStateToProps = createStructuredSelector({
  groupbyReports: getGroupbyReports,
  shifts: getShifts,
  shiftMaps: getShiftMaps,
  hrsMembers: getHrsMember,
  cache: getCache,
});

const mapDispatchToProps = dispatch => ({
  setReportShiftCache: shiftId =>
    dispatch(setReportShiftCache(shiftId)),
});

const SingleShiftOverviewContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SingleShiftOverview);

export default SingleShiftOverviewContainer;
