import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  showLoading,
  hideLoading,
} from 'vidya/LoadingBar';
import AdPodLeftPane from '../components/AdPodLeftPane';
import {
  getLocale,
  getSharedCategories,
  getCustomCategories,
  getSeries,
  getVideos,
  getAllCampaignBriefs,
} from '../selectors';

import {
  localize,
} from '../utils';

import {
  queryAllCampaignBriefs,
  getSeries as querySeries,
  queryAllVideos,
  requestAdCategories,
  requestAds,
  clearAdPodSearch,
  showAlert,
} from '../actions';


const mapStateToProps = createStructuredSelector(({
  locale: getLocale,
  sharedCategories: getSharedCategories,
  customCategories: getCustomCategories,
  series: getSeries,
  videos: getVideos,
  allCampaignBriefs: getAllCampaignBriefs,
}));

const mapDispatchToProps = dispatch => (
  {
    queryAllCampaignBriefs: () => dispatch(queryAllCampaignBriefs()),
    querySeries: () => dispatch(querySeries(true, false)),
    queryVideos: () => dispatch(queryAllVideos(true, true)),
    queryCategories: locale => dispatch(requestAdCategories(locale)),
    queryAds: (campaignId, videoIds, filterIds, limit, startTime, endTime) =>
      dispatch(requestAds(campaignId, videoIds, null, filterIds, 0, 0, limit, startTime, endTime)),
    showLoading: message => dispatch(showLoading(message)),
    hideLoading: () => dispatch(hideLoading()),
    clearSearchData: () => dispatch(clearAdPodSearch()),
    alert: message => dispatch(showAlert(message)),
  }
);

const Children = connect(
  mapStateToProps,
  mapDispatchToProps
)(localize(AdPodLeftPane));

const AdPodLeftPaneContainer = ({ match }) => (
  <Children campaignId={Number(match.params.campaignId)} />
);

AdPodLeftPaneContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

export default AdPodLeftPaneContainer;

