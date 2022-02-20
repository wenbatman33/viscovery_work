import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { LogUtil } from 'utils';

import styles from '../AdSettingLeftPane/AdSettingLeftPane.scss';
import VideoSelector from '../VideoSelector';
import SharedCustomItemSelector from '../SharedCustomItemSelector';
import DateDurationSelector from '../DateDurationSelector';

import ActionButtons from './ActionButtons';
import CategoryCard from './CategoryCard';
import CampaignSwitchCard from './CampaignSwitchCard';
import TimeCard from './TimeCard';
import EmptyCategoryListHolder from './EmptyCategoryListHolder';

import {
  SeriesCard,
} from '../AdSettingLeftPane';

import {
  AD_POD_LIMIT,
} from '../../constants';

import {
  getCategoryOption,
  getSelectedVideoCount,
  getSelectedVideoIds,
  handleLeftPaneOnBlur,
  isAllVideosSelected,
} from '../../utils';

const CARDS = {
  NONE: -1,
  VIDEOS: 0,
  FILTER: 1,
  TIME: 2,
};

const genCategoryOptions = (sharedList, customList) => [
  ...sharedList.map(getCategoryOption),
  ...customList.map(getCategoryOption),
];

const getDefaultState = () => (
  {
    expandItem: CARDS.NONE,
    selectedCategories: [],
    selectedVideos: {},
    startDate: null,
    endDate: null,
  }
);

class AdPodLeftPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryOptions: [],
      ...getDefaultState(),
    };
  }

  componentWillMount() {
    this.props.queryCategories(this.props.locale);
    this.props.querySeries();
    this.props.queryVideos();
    this.props.queryAllCampaignBriefs();
    this.queryAds(this.props.campaignId);
  }

  componentWillReceiveProps(nextProps) {
    // re-query filter list when site language changed
    if (this.props.locale !== nextProps.locale) {
      this.props.queryCategories(nextProps.locale);
    }

    if (!Object.is(this.props.sharedCategories, nextProps.sharedCategories) ||
      !Object.is(this.props.customCategories, nextProps.customCategories)) {
      const options = genCategoryOptions(nextProps.sharedCategories, nextProps.customCategories);
      this.setFilterOptions(options);
    }

    if (nextProps.campaignId && this.props.campaignId !== nextProps.campaignId) {
      this.queryAds(nextProps.campaignId);
    }
  }

  componentWillUnmount() {
    this.props.clearSearchData();
  }

  setFilterOptions = (options) => {
    this.setState({
      categoryOptions: options,
    });
  };

  setSelectedVideos = (selectVideos) => {
    this.setState({
      selectedVideos: selectVideos,
    });
  };

  setExpandItem = (itemKey) => {
    this.setState({
      expandItem: itemKey,
    });
  };

  setSelectedFilters = (values) => {
    this.setState({
      selectedCategories: values,
    });
  };

  clearSearch = () => {
    this.setState(getDefaultState());
    this.props.clearSearchData();
  };

  handleCategoryRemove = (filterId) => {
    const index = this.state.selectedCategories.findIndex(option => option.value === filterId);

    if (index > -1) {
      const nextSelected = [
        ...this.state.selectedCategories.slice(0, index),
        ...this.state.selectedCategories.slice(index + 1),
      ];
      this.setState({
        selectedCategories: nextSelected,
      });
    }
  };

  handleSelectedFiltersChange = (options) => {
    this.setSelectedFilters(options);
  };

  handleCardExpandChange = (eventKey) => {
    const nextItem = eventKey === this.state.expandItem ? CARDS.NONE : eventKey;
    this.setExpandItem(nextItem);
  };

  handleDateChange = (startDate, endDate) => {
    this.setState({
      startDate,
      endDate,
    });
  };

  handleSearchBtnClick = () => {
    const all = isAllVideosSelected(this.state.selectedVideos, this.props.series);
    const filterIds = this.state.selectedCategories.map(c => c.value);
    const videoIds = all ? null : getSelectedVideoIds(this.state.selectedVideos);
    this.queryAds(
      this.props.campaignId, videoIds, filterIds, this.state.startDate, this.state.endDate
    );
  };

  queryAds = (campaignId, videoIds, filterIds, startDate, endDate) => {
    this.props.showLoading(this.props.t('searching'));
    this.doCollapse();

    this.props.queryAds(
      campaignId,
      videoIds,
      filterIds,
      AD_POD_LIMIT,
      startDate,
      endDate,
    )
      .then(this.props.hideLoading)
      .catch((ex) => {
        LogUtil.debug(`Get ads failed, ex=${ex}`);
        this.props.hideLoading();
        this.props.alert(this.props.t('request_failed_message'));
      });
  };

  doCollapse = () => {
    if (this.state.expandItem !== CARDS.NONE) {
      this.setState({
        expandItem: CARDS.NONE,
      });
    }
  };

  handleCollapse = (e) => {
    handleLeftPaneOnBlur(e, document, this.doCollapse, 'rc-calendar');
  };

  handleCurrentCampaign = campaigns =>
    campaigns.find(campaign => campaign.campaign_id === this.props.campaignId) || null;

  render() {
    return (
      <div
        styleName={`container${this.props.disabled ? '-overlay' : ''}`}
        tabIndex={-1}
        onBlur={this.handleCollapse}
      >
        <div styleName="static-container">
          <CampaignSwitchCard
            campaign={this.handleCurrentCampaign(this.props.allCampaignBriefs)}
            allCampaign={this.props.allCampaignBriefs}
          />
          <SeriesCard
            eventKey={CARDS.VIDEOS}
            onExpandChange={this.handleCardExpandChange}
            expanded={this.state.expandItem === CARDS.VIDEOS}
            count={getSelectedVideoCount(this.state.selectedVideos)}
            placeholder={this.props.t('selectVideosForAdPodSearch')}
          />
          <CategoryCard
            eventKey={CARDS.FILTER}
            onExpandChange={this.handleCardExpandChange}
            expanded={this.state.expandItem === CARDS.FILTER}
            categories={
            [
              ...this.props.sharedCategories,
              ...this.props.customCategories,
            ]
            }
            selectedCategories={this.state.selectedCategories}
            onRemoveClick={this.handleCategoryRemove}
          />
          <TimeCard
            eventKey={CARDS.TIME}
            onExpandChange={this.handleCardExpandChange}
            expanded={this.state.expandItem === CARDS.TIME}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
          <div styleName="btn-group">
            <ActionButtons
              styleName="btn-group"
              onClearSearch={this.clearSearch}
              onSearch={this.handleSearchBtnClick}
            />
          </div>
        </div>
        <div
          styleName={
            `float-container-${this.state.expandItem === CARDS.NONE ? 'hide' : 'show'}`
          }
        >
          {
            this.state.expandItem === CARDS.VIDEOS ?
              <VideoSelector
                withAdvancedFilter={false}
                series={this.props.series}
                videos={this.props.videos}
                onSelectionChange={this.setSelectedVideos}
                selected={this.state.selectedVideos}
              />
              : null
          }
          {
            this.state.expandItem === CARDS.FILTER ?
              <SharedCustomItemSelector
                withTabs={false}
                options={this.state.categoryOptions}
                value={this.state.selectedCategories}
                onChange={this.handleSelectedFiltersChange}
                inputPlaceholder={this.props.t('inputForNeededCategory')}
                customList={
                  this.props.customCategories.length > 0 ?
                    null :
                    <EmptyCategoryListHolder
                      text={this.props.t('emptyCategoryList')}
                    />
                }
              />
              : null
          }
          {
            this.state.expandItem === CARDS.TIME ?
              <DateDurationSelector
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onDateChange={this.handleDateChange}
              />
              : null
          }
        </div>
      </div>
    );
  }
}

AdPodLeftPane.propTypes = {
  t: PropTypes.func,
  // data
  disabled: PropTypes.bool,
  locale: PropTypes.string,
  series: PropTypes.array,
  sharedCategories: PropTypes.array,
  customCategories: PropTypes.array,
  videos: PropTypes.object,
  campaignId: PropTypes.number.isRequired,
  // actions
  queryCategories: PropTypes.func,
  querySeries: PropTypes.func,
  queryVideos: PropTypes.func,
  queryAds: PropTypes.func,
  queryAllCampaignBriefs: PropTypes.func,
  showLoading: PropTypes.func,
  hideLoading: PropTypes.func,
  clearSearchData: PropTypes.func,
  alert: PropTypes.func,
  allCampaignBriefs: PropTypes.arrayOf(PropTypes.object),
};


export default CSSModules(AdPodLeftPane, styles);
