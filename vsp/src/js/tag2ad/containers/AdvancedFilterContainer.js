import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import R from 'ramda';

import {
  mapAdvancedFilterKey,
} from '../utils/advancedFilter';

import {
  getAdvancedOptions,
  advancedValuesReceiveMapping,
  queryAllVideos,
  getSeries,
} from '../actions';

import AdvancedFilter from '../components/AdvancedFilter';

import {
  getGenreOptions,
  getVideoYearOptions,
  getHrsOptions,
  getPlayViewsOptions,
  getRunningTimeOptions,
  getGenreValues,
  getPlayViewsValues,
  getVideoYearValues,
  getRunningTimeValues,
  getHrsValues,
  getFilterValues,
} from '../selectors';

import {
  getLocale,
} from '../../app/selectors';

const mapArrayToCommaSeparate = R.map(
  ele => ele.join(',')
);

const handleAdvancedFilter = R.compose(
  mapAdvancedFilterKey,
  R.filter(v => v !== ''),
  mapArrayToCommaSeparate,
);

const wrapQueryAllVideos = advancedFilter => queryAllVideos(true, true, advancedFilter);
const wrapQueryAllSeries = advancedFilter => getSeries(true, false, advancedFilter);

const mapStateToProps = createStructuredSelector(
  {
    genreOptions: getGenreOptions,
    playViewsOptions: getPlayViewsOptions,
    videoYearOptions: getVideoYearOptions,
    runningTimeOptions: getRunningTimeOptions,
    hrsOptions: getHrsOptions,
    genreValues: getGenreValues,
    playViewsValues: getPlayViewsValues,
    videoYearValues: getVideoYearValues,
    runningTimeValues: getRunningTimeValues,
    hrsValues: getHrsValues,
    locale: getLocale,
    filterValues: getFilterValues,
  }
);

const mapDispatchToProps = dispatch => ({
  getAdvancedOptions: lang => dispatch(getAdvancedOptions(lang)),
  setAdvancedValues: key => value => dispatch(advancedValuesReceiveMapping[key](value)),
  submit: filterValues =>
    dispatch(wrapQueryAllVideos(handleAdvancedFilter(filterValues)))
      .then(() => dispatch(wrapQueryAllSeries(handleAdvancedFilter(filterValues)))),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => (
  {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    getAdvancedOptions: () =>
      dispatchProps.getAdvancedOptions(stateProps.locale),
  }
);

const AdvancedFilterContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  { withRef: true }
)(AdvancedFilter);

export default AdvancedFilterContainer;
