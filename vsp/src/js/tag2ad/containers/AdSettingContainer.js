import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { showLoading, hideLoading } from 'vidya/LoadingBar';
import {
  getAdForms,
  getAdCategories,
  getLocale,
  isChanceSearchEmpty,
  getAdChances,
  chanceVideoCount,
  chanceCount,
  getTagBrands,
  getSeries,
  getLastChanceSearchParams,
} from '../selectors';

import {
  requestAdCategories,
  requestAdForms,
  queryAdChance,
  showAlert,
  setMessage,
} from '../actions';

import { AD_SEARCH_LIMIT } from '../constants';

import AdSetting from '../components/AdSetting';
import {
  toChanceSearchPayload,
  isAllVideosSelected,
} from '../utils';
import {
  extractCampaignId,
} from '../utils/routerMatch';
import { adsApi } from '../api';


const mapStateToProps = createStructuredSelector(({
  videos: getAdChances,
  adCategories: getAdCategories,
  adForms: getAdForms,
  isSearchEmpty: isChanceSearchEmpty,
  totalVideos: chanceVideoCount,
  locale: getLocale,
  totalChances: chanceCount,
  brands: getTagBrands,
}));

const mapDispatchToProps = dispatch => (
  {
    requestAdCategories: locale => dispatch(requestAdCategories(locale)),
    requestAdForms: locale => dispatch(requestAdForms(locale)),
    showLoading: () => dispatch(showLoading()),
    hideLoading: () => dispatch(hideLoading()),
    alert: message => dispatch(showAlert(message)),
    setMessage: (message, messageSuccess) => dispatch(setMessage(message, messageSuccess)),
  }
);

const Children = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdSetting);

const containerMapStateToProps = createStructuredSelector(({
  series: getSeries,
  lastSearchParams: getLastChanceSearchParams,
}));

const containerMapDispatchToProps = dispatch => (
  {
    requestAdChance: (all, videos, filters, config, pageNum, hash) =>
      dispatch(queryAdChance(all, videos, filters, config, pageNum, AD_SEARCH_LIMIT, hash)),
  }
);

class AdSettingContainer extends React.PureComponent {
  handlePageChange = (targetPage) => {
    const all = isAllVideosSelected(
      this.props.lastSearchParams.videos,
      this.props.series,
    );
    const filterIDs = this.props.lastSearchParams.filters;

    return this.props.requestAdChance(
      all,
      this.props.lastSearchParams.videos,
      filterIDs,
      this.props.lastSearchParams.config,
      targetPage,
      this.props.lastSearchParams.hash,
    );
  };

  handleCreateAdsWithSearch = (adFilterId, formId) => {
    const { lastSearchParams } = this.props;
    const filterIDs = lastSearchParams.filters;
    const campaignId = extractCampaignId(this.props.match);
    const payload = toChanceSearchPayload(
      lastSearchParams.videos,
      filterIDs,
      lastSearchParams.config,
      0,
      AD_SEARCH_LIMIT,
    );

    return adsApi.createWithSearchResult(
      campaignId,
      adFilterId,
      formId,
      payload.filter_content,
      payload.video_map,
      filterIDs,
    );
  };

  render() {
    const { lastSearchParams } = this.props;

    const defaultCategory = lastSearchParams.filters && lastSearchParams.filters.length > 0 ?
      lastSearchParams.filters[0] :
      null;
    const campaignId = extractCampaignId(this.props.match);

    return (
      <Children
        searchConfig={lastSearchParams.config}
        defaultPage={lastSearchParams.page}
        defaultCategory={defaultCategory}
        onPageChange={this.handlePageChange}
        onCreateAllAds={this.handleCreateAdsWithSearch}
        campaignId={campaignId}
        searchHash={lastSearchParams.hash}
      />
    );
  }
}

AdSettingContainer.propTypes = {
  lastSearchParams: PropTypes.object,
  series: PropTypes.array,
  requestAdChance: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.object,
    path: PropTypes.string,
    url: PropTypes.string,
  }),
};

export default connect(
  containerMapStateToProps,
  containerMapDispatchToProps,
)(AdSettingContainer);
