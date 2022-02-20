import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import ShiftMapForm from '../../components/ReportApp/Settings/ShiftMapForm';

import {
  getShiftMaps,
  getShifts,
} from '../../selectors/hrsReportSelector';

import {
  getHrsMember,
} from '../../selectors/hrsAdminSelector';

import {
  updateShiftMapRecords,
} from '../../actions';

const mapStateToProps = createStructuredSelector({
  shiftMaps: getShiftMaps,
  shifts: getShifts,
  hrsMembers: getHrsMember,
});

const mapDispatchToProps = dispatch => ({
  updateShiftMapRecords: (preShiftMapRecords, shiftMapRecords) =>
    dispatch(updateShiftMapRecords(preShiftMapRecords, shiftMapRecords)),
});

const ShiftMapFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShiftMapForm);

export default ShiftMapFormContainer;
