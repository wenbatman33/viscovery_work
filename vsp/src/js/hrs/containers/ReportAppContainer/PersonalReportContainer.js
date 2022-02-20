import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PersonalReport from '../../components/ReportApp/PersonalReport';

import {
  getReports,
  setReportPersonalCache,
} from '../../actions';

import * as hrsSelector from '../../selectors/hrsReportSelector';
import { getHrsMember } from '../../selectors/hrsAdminSelector';
import { getLang } from '../../selectors/langSelector';


const mapStateToProps = createStructuredSelector({
  reports: hrsSelector.getReports,
  cache: hrsSelector.getCache,
  hrsMembers: getHrsMember,
  lang: getLang,
});

const mapDispatchToProps = dispatch => ({
  getReports: (since, to, lang, userId) =>
    dispatch(getReports(since, to, lang, userId)),
  setReportPersonalCache: shiftId =>
    dispatch(setReportPersonalCache(shiftId)),
});

const PersonalReportContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonalReport);

export default PersonalReportContainer;
