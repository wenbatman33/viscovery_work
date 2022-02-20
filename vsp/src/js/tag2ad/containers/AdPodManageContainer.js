import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { showLoading, hideLoading } from 'vidya/LoadingBar';

import {
  requestAdCategories,
  requestAdForms,
  requestAds,
  showAlert,
  deleteAds,
  deleteAd,
  updateAd,
  updateAds,
  setMessage,
} from '../actions';
import AdPodManagement from '../components/AdPodManagement';
import {
  getAdForms,
  getAdCategories,
  getLocale,
  getAds,
  getAdVideoCount,
  getAdCount,
  getAdSearchConfig,
  adsSearchEmpty,
  getAdsActivePage,
  disableExportAds,
} from '../selectors';
import { localize } from '../utils';

const mapStateToProps = createStructuredSelector(({
  adCategories: getAdCategories,
  adForms: getAdForms,
  locale: getLocale,
  videos: getAds,
  totalVideos: getAdVideoCount,
  totalAdCount: getAdCount,
  searchConfig: getAdSearchConfig,
  isSearchEmpty: adsSearchEmpty,
  activePage: getAdsActivePage,
  disableExport: disableExportAds,
}));

const mapDispatchToProps = dispatch => ({
  requestAdCategories: () => dispatch(requestAdCategories()),
  requestAdForms: () => dispatch(requestAdForms()),
  showLoading: message => dispatch(showLoading(message)),
  hideLoading: () => dispatch(hideLoading()),
  requestAds: (campaignId, videoIds, subCategoryIds, filterIds, offset, limit, startTime,
    endTime) => dispatch(
      requestAds(campaignId, videoIds, subCategoryIds, filterIds, 0, offset, limit, startTime,
        endTime)
    ),
  showAlert: message => dispatch(showAlert(message)),
  requestDeleteAds: (campaignId, adIdArray, videoIds, filterIDs, startTime, endTime, all) =>
    dispatch(deleteAds(campaignId, adIdArray, videoIds, filterIDs, startTime, endTime, all)),
  requestDeleteAd: (videoId, adId) => dispatch(deleteAd(videoId, adId)),
  requestUpdateAd: (adId, contentStr) => dispatch(updateAd(adId, contentStr)),
  requestUpdateAds: (campaignId, adsContentStr, all, videoIDs, filterIDs, startTime, endTime,
    content) => dispatch(
      updateAds(campaignId, adsContentStr, all, videoIDs, filterIDs, startTime, endTime, content)
    ),
  setMessage: message => dispatch(setMessage(message)),
});

const Children = connect(
  mapStateToProps,
  mapDispatchToProps
)(localize(AdPodManagement));

const AdPodManageContainer = ({ match }) => (
  <Children campaignId={Number(match.params.campaignId)} />
);

AdPodManageContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

export default AdPodManageContainer;
