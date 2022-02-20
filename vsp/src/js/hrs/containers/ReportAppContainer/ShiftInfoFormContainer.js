import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import ShiftInfoForm from '../../components/ReportApp/Settings/ShiftInfoForm';

import {
  getShifts,
} from '../../selectors/hrsReportSelector';

import {
  updateManyShifts,
} from '../../actions';

const mapStateToProps = createStructuredSelector({
  shifts: getShifts,
});

const mapDispatchToProps = dispatch => ({
  updateManyShifts: shifts => dispatch(updateManyShifts(shifts)),
});

const ShiftInfoFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShiftInfoForm);

export default ShiftInfoFormContainer;
