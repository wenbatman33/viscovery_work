import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'vidya/LoadingBar';
import {
  getLocale,
  getCurrentGroup,
} from '../selector';
import { localize } from '../utils';
import { TagChanceReport } from '../components';

const mapStateToProps = createStructuredSelector(({
  locale: getLocale,
  group: getCurrentGroup,
}));

const mapDispatchToProps = dispatch => ({
  showLoading: () => { dispatch(showLoading); },
  hideLoading: () => { dispatch(hideLoading); },
});

const TagChanceReportContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(localize(TagChanceReport, 'TagChanceReport'));

export default TagChanceReportContainer;
