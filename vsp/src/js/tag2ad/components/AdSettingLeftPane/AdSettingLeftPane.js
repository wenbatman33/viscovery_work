import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'vidya/Dialogs';
import CSSModules from 'react-css-modules';
import routerUtil from 'utils/routerUtil';

// summary cards on the static pane
import SeriesCard from './SeriesCard';
import FilterCard from './FilterCard';
import ChanceCard from './ChanceCard';
import CampaignInfo from './CampaignInfo';

import ActionButtons from './ActionButtons';
import CampaignNotFound from './CampaignNotFound';

// for float pane
import VideoSelector from '../VideoSelector';
import SharedCustomItemSelector from '../SharedCustomItemSelector';
import AdChanceConfig from '../AdChanceConfig';
import FilterCustomList from './FilterCustomList';

import FilterDeleteConfirmForm from './FilterDeleteConfirmForm';

import styles from './AdSettingLeftPane.scss';
import { PATH } from '../../constants';
import * as helper from './helper';

import {
  getFilterOption,
  getSelectedVideoCount,
  handleLeftPaneOnBlur,
  localize,
  isAllVideosSelected,
  getFilterById,
  getUserIdByUser,
} from '../../utils';

export const CARDS = {
  NONE: -1,
  VIDEOS: 0,
  FILTER: 1,
  CONFIG: 2,
};

const genFilterOptions = (sharedFilters, customFilters, userId) => {
  const shared = sharedFilters.map(getFilterOption);
  const custom = customFilters.map(f => getFilterOption(f, userId));
  return [...shared, ...custom];
};

class AdSettingLeftPane extends React.Component {

  state = {
    expandItem: CARDS.NONE,
    filterOptions: genFilterOptions(
      this.props.sharedFilters,
      this.props.customFilters,
      getUserIdByUser(this.props.user)
    ),
    selectedVideos: this.props.lastSearchParams.videos,
    selectedFilters: helper.getFilterOptionsByIDs(
      [...this.props.sharedFilters, ...this.props.customFilters],
      this.props.lastSearchParams.filters,
      getUserIdByUser(this.props.user),
    ),
    chanceConfig: this.props.lastSearchParams.config,
    defaultFilterTab: 0,
  };

  componentWillMount() {
    this.props.queryFilterList(this.props.locale);
    this.props.querySeries();
    this.props.queryAllVideos();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.query.custom_filter !== nextProps.location.query.custom_filter &&
      nextProps.location.query.custom_filter === '1') {
      this.container.focus();
      this.setState({
        expandItem: CARDS.FILTER,
        defaultFilterTab: 1,
      }, () => {
        this.setState({
          defaultFilterTab: 0,
        });
      });
    }

    if (this.props.disabled !== nextProps.disabled && nextProps.disabled) {
      this.setState({
        expandItem: CARDS.NONE,
      });
    }

    if (this.props.locale !== nextProps.locale) {
      this.props.queryFilterList(nextProps.locale);
    }

    if (!Object.is(this.props.sharedFilters, nextProps.sharedFilters) ||
      !Object.is(this.props.customFilters, nextProps.customFilters) ||
        this.props.user !== nextProps.user
    ) {
      this.setState(
        {
          filterOptions: genFilterOptions(
            nextProps.sharedFilters,
            nextProps.customFilters,
            getUserIdByUser(nextProps.user),
          ),
        }
      );
    }
  }

  componentWillUnmount() {
    this.props.clearSearch();
  }

  getFloatPaneContent = (expandItem) => {
    switch (expandItem) {
      case CARDS.VIDEOS:
        return (
          <VideoSelector
            withAdvancedFilter
            series={this.props.series}
            videos={this.props.videos}
            onSelectionChange={this.handleVideoSelectChange}
            selected={this.state.selectedVideos}
          />
        );
      case CARDS.FILTER:
        return (
          <SharedCustomItemSelector
            options={this.state.filterOptions}
            value={this.state.selectedFilters}
            onChange={this.handleSelectedFiltersChange}
            customList={
              <FilterCustomList
                onRemoveFilter={this.requestRemoveFilter}
                campaignId={this.props.campaignId}
              />
            }
            defaultTab={this.state.defaultFilterTab}
            inputPlaceholder={this.props.t('searchFilter')}
          />
        );
      case CARDS.CONFIG:
        return (
          <AdChanceConfig
            config={this.state.chanceConfig}
            onChange={this.handleChanceConfigChange}
          />
        );
      default:
        return null;
    }
  };

  requestRemoveFilter = (filterId) => {
    if (filterId) {
      const { removeFilter } = this.props;
      const filters = this.props.sharedFilters.concat(this.props.customFilters);
      const filter = getFilterById(filters, filterId);
      const hideModal = this.hideModal;
      this.modal.switchContent(
        <FilterDeleteConfirmForm
          filterId={filterId}
          filterName={filter.name()}
          onCancel={this.hideModal}
          onConfirm={(id) => {
            removeFilter(id);
            hideModal();
          }}
          warningMessage={this.props.t('deleteFilterWarning')}
        />
      );
      this.showModal();
    }
  };

  handleVideoSelectChange = (selected) => {
    this.setState({
      selectedVideos: selected,
    });
  };

  handleSelectedFiltersChange = (optionsArray) => {
    this.setState({
      selectedFilters: optionsArray,
    });
  };

  showModal = () => {
    if (this.modal) {
      this.modal.toShow();
    }
  };

  hideModal = () => {
    if (this.modal) {
      this.modal.toHide();
    }
  };

  handleChanceConfigChange = (newConfig) => {
    this.setState({
      chanceConfig: newConfig,
    });
  };

  handleCardExpandChange = (eventKey) => {
    if (eventKey === this.state.expandItem || this.props.disabled) {
      this.setState({
        expandItem: CARDS.NONE,
      });
    } else {
      this.setState({
        expandItem: eventKey,
      });
    }
  };

  removeSelectedFilter = (filterId) => {
    const { selectedFilters } = this.state;
    if (!this.props.disabled && filterId) {
      const index = selectedFilters.findIndex(option => option.value === filterId);
      if (index > -1) {
        const newSelected = [
          ...selectedFilters.slice(0, index),
          ...selectedFilters.slice(index + 1),
        ];
        this.setState({
          selectedFilters: newSelected,
        });
      }
    }
  };

  handleFilterClick = (filterId) => {
    routerUtil.pushHistory(`${PATH.CHANCE_SEARCH}/${this.props.campaignId}/filter/${filterId}`);
  };

  doCollapse = () => {
    this.setState({
      expandItem: CARDS.NONE,
    });
  };
  handleCollapse = (e) => {
    handleLeftPaneOnBlur(e, document, this.doCollapse);
  };

  handleSearchClick = () => {
    const {
      selectedFilters,
      selectedVideos,
      chanceConfig,
    } = this.state;

    const all = isAllVideosSelected(
      selectedVideos,
      this.props.series,
    );

    const promises = [];

    const filterIDs = selectedFilters.map(o => o.value);

    if (this.props.tagBrands.length === 0) {
      promises.push(this.props.queryTags(this.props.locale));
    }

    promises.push(
      this.props.requestAdChance(
        all,
        selectedVideos,
        filterIDs,
        chanceConfig,
        1,
      )
    );

    this.props.showLoading(this.props.t('searching'));
    this.doCollapse();

    Promise.all(promises)
      .then(this.props.hideLoading)
      .catch(() => {
        this.props.hideLoading();
        this.props.alert(`${this.props.t('request_failed_message')}`);
      });
  };

  handleClearBtnClick = () => {
    this.setState({
      selectedVideos: {},
      selectedFilters: [],
      chanceConfig: null,
    }, () => {
      this.props.clearSearch();
    });
  };

  handleCampaignNotFound = (id) => {
    const content = (
      <CampaignNotFound
        campaignId={id}
        onTimesUp={() => {
          this.modal.toHide();
          routerUtil.pushHistory('/tag2ad/campaignList');
        }}
      />
    );
    this.modal.switchContent(content);
    this.modal.toShow();
  };

  render() {
    return (
      <div
        styleName={`container${this.props.disabled ? '-overlay' : ''}`}
        tabIndex={-1}
        onBlur={this.handleCollapse}
        ref={(node) => {
          this.container = node;
        }}
      >
        <div styleName="static-container">
          <CampaignInfo
            campaignId={this.props.campaignId}
            onNotFound={this.handleCampaignNotFound}
          />
          <SeriesCard
            eventKey={CARDS.VIDEOS}
            onExpandChange={this.handleCardExpandChange}
            expanded={this.state.expandItem === CARDS.VIDEOS}
            count={getSelectedVideoCount(this.state.selectedVideos)}
            placeholder={this.props.t('selectVideosForAdChanceSearch')}
          />

          <FilterCard
            eventKey={CARDS.FILTER}
            onExpandChange={this.handleCardExpandChange}
            expanded={this.state.expandItem === CARDS.FILTER}
            selectedFilters={this.state.selectedFilters}
            filters={
            [
              ...this.props.sharedFilters,
              ...this.props.customFilters,
            ]
            }
            onRemoveClick={this.removeSelectedFilter}
            onItemClick={this.handleFilterClick}
            userId={getUserIdByUser(this.props.user)}
            campaignId={this.props.campaignId}
          />

          <ChanceCard
            eventKey={CARDS.CONFIG}
            onExpandChange={this.handleCardExpandChange}
            expanded={this.state.expandItem === CARDS.CONFIG}
            config={this.state.chanceConfig}
          />
          <div styleName="btn-group">
            <ActionButtons
              styleName="btn-group"
              onClearSearch={this.handleClearBtnClick}
              onSearch={this.handleSearchClick}
              disableSearch={
                this.state.selectedFilters.length === 0 ||
                !helper.isChanceConfigValid(this.state.chanceConfig)
              }
            />
          </div>
        </div>
        <div
          styleName={
            `float-container-${this.state.expandItem === CARDS.NONE ? 'hide' : 'show'}`
          }
        >
          {
            this.getFloatPaneContent(this.state.expandItem)
          }
        </div>
        <Modal
          ref={(node) => { this.modal = node; }}
          headerHide
          hideWhenBackground
        />
      </div>
    );
  }
}

AdSettingLeftPane.defaultProps = {
  disabled: false,
  series: [],
};

AdSettingLeftPane.propTypes = {
  disabled: PropTypes.bool,
  series: PropTypes.array,
  sharedFilters: PropTypes.array,
  customFilters: PropTypes.array,
  tagBrands: PropTypes.array,
  t: PropTypes.func,
  locale: PropTypes.string,
  queryFilterList: PropTypes.func,
  videos: PropTypes.object,
  user: PropTypes.object,
  lastSearchParams: PropTypes.object,
  removeFilter: PropTypes.func,
  querySeries: PropTypes.func,
  clearSearch: PropTypes.func,
  queryAllVideos: PropTypes.func,
  requestAdChance: PropTypes.func,
  queryTags: PropTypes.func,
  showLoading: PropTypes.func,
  hideLoading: PropTypes.func,
  alert: PropTypes.func,
  location: PropTypes.object,
  campaignId: PropTypes.number.isRequired,
};


export default localize(CSSModules(AdSettingLeftPane, styles));
