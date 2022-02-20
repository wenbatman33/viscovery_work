import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import R from 'ramda';
import { createStructuredSelector } from 'reselect';
import { showLoading, hideLoading } from 'vidya/LoadingBar';
import AdSettingLeftPane from '../components/AdSettingLeftPane';
import {
  getLocale,
  getSharedFilters,
  getCustomFilters,
  getSeries,
  getVideos,
  getTagBrands,
  getLastChanceSearchParams,
  getUser,
  getFilterValues,
} from '../selectors';

import {
  getFilterList,
  removeFilter,
  getSeries as querySeries,
  clearAdSettingSearch,
  queryAllVideos,
  queryAdChance,
  queryAllTags,
  showAlert,
} from '../actions';

import {
  mapAdvancedFilterKey,
} from '../utils/advancedFilter';

import { AD_SEARCH_LIMIT } from '../constants';

const handleAdvancedFilter = R.compose(
  R.map(value => value.map(Number)),
  mapAdvancedFilterKey,
);

const mapStateToProps = createStructuredSelector(({
  locale: getLocale,
  sharedFilters: getSharedFilters,
  customFilters: getCustomFilters,
  series: getSeries,
  videos: getVideos,
  tagBrands: getTagBrands,
  lastSearchParams: getLastChanceSearchParams,
  user: getUser,
  filterValues: getFilterValues,
}));

const mapDispatchToProps = dispatch => (
  {
    queryFilterList: locale => dispatch(getFilterList(locale)),
    removeFilter: filterId => dispatch(removeFilter(filterId)),
    querySeries: () => dispatch(querySeries(true, false)),
    clearSearch: () => dispatch(clearAdSettingSearch()),
    queryAllVideos: () => dispatch(queryAllVideos(true, true)),
    requestAdChance: (all, videos, filters, config, pageNum, searchHash, advancedFilter) =>
      dispatch(
        queryAdChance(
          all, videos, filters, config, pageNum, AD_SEARCH_LIMIT, searchHash, advancedFilter
        )
      ),
    queryTags: locale => dispatch(queryAllTags(locale)),
    showLoading: message => dispatch(showLoading(message)),
    hideLoading: () => dispatch(hideLoading()),
    alert: message => dispatch(showAlert(message)),
  }
);

const mergeProps = (stateProps, dispatchProps, ownProps) => (
  {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    requestAdChance: (all, videos, filters, config, pageNum) =>
      dispatchProps.requestAdChance(
        all, videos, filters, config, pageNum, null, handleAdvancedFilter(stateProps.filterValues)
      ),
  }
);

const Children = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(AdSettingLeftPane);


const isDisabled = (url) => {
  const re = /adsearch\/[0-9]+\/filter/;
  return re.test(url);
};

const AdSettingLeftPaneContainer = (props) => {
  const { disabled, match } = props;
  const campaignId = isNaN(match.params.campaign) ?
    match.params.campaign :
    Number(match.params.campaign);

  return (
    <Children
      disabled={disabled || isDisabled(match.url)}
      campaignId={campaignId}
      {...props}
    />
  );
};

AdSettingLeftPaneContainer.propTypes = {
  disabled: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.object,
    path: PropTypes.string,
    url: PropTypes.string,
  }),
};

export default AdSettingLeftPaneContainer;

