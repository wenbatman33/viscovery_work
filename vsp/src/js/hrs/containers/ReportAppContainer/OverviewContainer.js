import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Overview from '../../components/ReportApp/Overview';

import {
  getGroupbyReports,
  getShiftMaps,
  getShifts,
} from '../../selectors/hrsReportSelector';

import { getHrsMember } from '../../selectors/hrsAdminSelector';

import {} from '../../actions';

const mapStateToProps = createStructuredSelector({
  groupbyReports: getGroupbyReports,
  shiftMaps: getShiftMaps,
  shifts: getShifts,
  hrsMembers: getHrsMember,
});

const mapDispatchToProps = () => ({});

const OverviewContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Overview);

export default OverviewContainer;
