/**
 * Created Date : 2017/1/23
 * Copyright (c) Viscovery.co
 * Author : Amdis Liu <amdis.liu@viscovery.co>
 * Contributor :
 * Description :
 */
import React from 'react';
import PropTypes from 'prop-types';

import CSSModules from 'react-css-modules';
import { forceCheck } from 'react-lazyload';
import R from 'ramda';

import { Checkbox } from 'vidya/Form';
import { Modal } from 'vidya/Dialogs';
import {
  ListView,
  HorizontalDivider,
} from 'vidya';

import { LogUtil } from 'utils';

import VideoRow from './VideoRow';
import {
  AdPodStyle,
  Paging,
  helper,
  SearchEmptyMessage,
  EmptyPlaceholder,
} from '../AdPodManagement';
import BatchActionFloatBar from '../BatchActionFloatBar';

import FailFeedbackHrs from './FailFeedbackHrs';

import ReportWrongTags from './ReportWrongTags';

import SummaryActionBar from './SummaryActionBar';


import { Ad } from '../../models';
import { getNextSelected, localize, scrollNodeIntoView } from '../../utils';
import {
  mergeDisabledList,
  getFeedbackData,
  flatSelectedChances,
} from '../../utils/feedbackHrs';
import {
  AD_SEARCH_LIMIT,
} from '../../constants';
import { adsApi } from '../../api';
import {
  feedbackToHrsApi,
} from '../../api/feedbackApi';


const MODES = {
  DEFAULT: 'default',
  SINGLE: 'single',
  MULTIPLE: 'multiple',
};

const SELECTED_TYPE = {
  BORDERED: 'bordered',
  CHECKED: 'checked',
};

const NO_SELECTED = {
  type: SELECTED_TYPE.CHECKED,
  values: [],
};

/**
 * get default state of AdSetting
 *
 * @param {any} state
 * @return {Object} state
 * @return {String} state.mode
 * @return {Object} state.selected
 * @return {Array} state.ads
 * @return {Boolean} state.isAll
 */
const getDefaultState = state => (
  {
    mode: MODES.DEFAULT,
    selected: getDefaultSelected(),
    ads: state ? state.ads : [],
    isAll: false,
  }
);

// const getFirstVideoId = R.path([0, 'video_id']);
// const getFirstName = R.path([0, '_name']);

// const mapSelectedValueToString = R.map(value => (
//   `${value.videoId}-${R.join(',')(value.index)}`
// ));

// const compareSelected = R.compose(
//   R.join(';'),
//   mapSelectedValueToString,
//   R.prop('values'),
// );

// const compareDisabledList = R.compose(
//   R.join(';'),
//   mapSelectedValueToString,
// );
const alldisabled = (videos, disabledList) => {
  let chanceCount = 0;
  let disableCount = 0;

  videos.forEach((v) => {
    chanceCount += v.chances.length;
  });

  disabledList.forEach((v) => {
    disableCount += v.index.length;
  });
  return chanceCount === disableCount;
};

class AdSetting extends React.Component {
  state = {
    ...getDefaultState(this.state),
    activePage: this.props.defaultPage || 1,
    disabledList: [],
  };

  componentDidMount() {
    this.queryFormsAndCategories(this.props.locale);
    if (this.props.videos && Object.keys(this.props.videos).length > 0) {
      this.queryAds(videosToIdArray(this.props.videos));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!Object.is(nextProps.videos, this.props.videos) && !nextProps.isSearchEmpty) {
      const nextState = {
        ...getDefaultState(this.state),
        toEditSearch: false,
        activePage: 1,
      };

      this.queryAds(videosToIdArray(nextProps.videos));
      this.setState(nextState);
    }

    if (nextProps.searchHash !== this.props.searchHash) {
      this.setState({
        disabledList: [],
      });
    }

    if (this.props.locale !== nextProps.locale) {
      this.resetToDefault();
      this.queryFormsAndCategories(nextProps.locale);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const {
  //     videos,
  //     locale,
  //     totalVideos,
  //     adForms,
  //     adCategories,
  //     searchConfig,
  //     isSearchEmpty,
  //     totalChances,
  //     defaultPage,
  //     defaultCategory,
  //   } = this.props;

  //   const {
  //     mode,
  //     ads,
  //     isAll,
  //     activePage,
  //     selected,
  //     disabledList,
  //   } = this.state;

  //   const {
  //     videos: nextVideos,
  //     locale: nextLocale,
  //     totalVideos: nextTotalVideos,
  //     adForms: nextAdForms,
  //     adCategories: nextAdCategories,
  //     searchConfig: nextSearchConfig,
  //     isSearchEmpty: nextIsSearchEmpty,
  //     totalChances: nextTotalChances,
  //     defaultPage: nextDefaultPage,
  //     defaultCategory: nextDefaultCategory,
  //   } = nextProps;

  //   const {
  //     mode: nextMode,
  //     ads: nextAds,
  //     isAll: nextIsAll,
  //     activePage: nextActivePage,
  //     selected: nextSelected,
  //     disabledList: nextDisabledList,
  //   } = nextState;

  //   if (
  //     locale === nextLocale
  //     && totalVideos === nextTotalVideos
  //     && isSearchEmpty === nextIsSearchEmpty
  //     && totalChances === nextTotalChances
  //     && defaultPage === nextDefaultPage
  //     && defaultCategory === nextDefaultCategory
  //     && getFirstVideoId(videos) === getFirstVideoId(nextVideos)
  //     && getFirstName(adForms) === getFirstName(nextAdForms)
  //     && getFirstName(adCategories) === getFirstName(nextAdCategories)
  //     && JSON.stringify(searchConfig) === JSON.stringify(nextSearchConfig)
  //     && mode === nextMode
  //     && isAll === nextIsAll
  //     && ads.length === nextAds.length
  //     && activePage === nextActivePage
  //     && compareSelected(selected) === compareSelected(nextSelected)
  //     && compareDisabledList(disabledList) === compareDisabledList(nextDisabledList)
  //   ) {
  //     return false;
  //   }

  //   return true;
  // }

  getVideoComponents = () => {
    const { videos } = this.props;
    const { selected } = this.state;
    const elements = [];
    let rows = [];
    const TopAnchor = (
      <div
        ref={(node) => {
          this.topAnchor = node;
        }}
      />
    );
    elements.push(TopAnchor);

    const common = {
      onImageClick: this.handleImageClick,
      onBtnClick: this.handleBtnClick,
      onCheckBoxClick: this.handleCheckBoxClick,
      onCloseClick: this.handleCloseBtnClick,
      onAdCreate: this.handleAdCreate,
      onAdDelete: this.handleAdDelete,
      disabledList: this.state.disabledList,
      ads: this.state.ads,
      adCategories: this.props.adCategories,
      adForms: this.props.adForms,
      t: this.props.t,
      brands: this.props.brands,
      onSelectAll: this.handleVideoCheckboxChange,
      locale: this.props.locale,
      defaultCategory: this.props.defaultCategory,
      campaignId: this.props.campaignId,
    };

    switch (this.state.mode) {
      case MODES.DEFAULT:
        rows = videos.map((video) => {
          const values = selected.values.filter(element => element.videoId === video.video_id);
          return (
            <VideoRow
              key={video.video_id}
              video={video}
              disableHover={false}
              hideClose
              {...common}
              disableCheckbox={false}
              selected={values.length ? Object.assign({}, selected, { values }) : NO_SELECTED}
            />
          );
        });
        break;
      case MODES.SINGLE:
        rows = videos.map((video) => {
          const values = selected.values.filter(element => element.videoId === video.video_id);
          return (
            <VideoRow
              key={video.video_id}
              video={video}
              disableHover
              hideClose={!values.length}
              showEditor
              onSelectChange={this.handleSelectChange}
              {...common}
              disableCheckbox
              selected={values.length ? Object.assign({}, selected, { values }) : NO_SELECTED}
              requestFeedbackApi={this.requestFeedbackApi}
            />
          );
        });
        break;
      case MODES.MULTIPLE:
        rows = videos.map((video) => {
          const values = selected.values.filter(element => element.videoId === video.video_id);
          return (
            <VideoRow
              key={video.video_id}
              video={video}
              disableHover={false}
              hideClose
              {...common}
              disableCheckbox={false}
              selected={values.length ? Object.assign({}, selected, { values }) : NO_SELECTED}
            />
          );
        });
        break;
      default:
        break;
    }

    return elements.concat(rows);
  };

  getDisabledListNumber = () => (
    flatSelectedChances(this.state.disabledList).length
  )

  getAdNumber = () => (
    this.state.isAll ?
      this.props.totalChances - this.getDisabledListNumber() :
      helper.getSelectedNumber(this.state.selected)
  )

  // info : { videoId : ${id}, index: ${index_in_row}, selected : ${true_or_false}}
  handleImageClick = (info) => {
    let selected = null;

    switch (this.state.mode) {
      case MODES.DEFAULT:
      case MODES.SINGLE:
        selected = getNextSelected(this.state.selected, info, false, SELECTED_TYPE.BORDERED);
        this.updateMode(MODES.SINGLE);
        this.updateSelected(selected);
        break;
      case MODES.MULTIPLE:
        selected = getNextSelected(this.state.selected, info, true, SELECTED_TYPE.CHECKED);
        if (selected.values.length > 0) {
          this.updateSelected(selected);
          this.updateMode(MODES.MULTIPLE);
        } else {
          this.resetToDefault();
        }
        break;
      default:
        break;
    }
  };

  handleBtnClick = (info) => {
    switch (this.state.mode) {
      case MODES.DEFAULT:
      case MODES.SINGLE:
        this.handleImageClick(info);
        break;
      default:
        break;
    }
  };

  handleCheckBoxClick = (info) => {
    /**
     * Expect selected to be of
     * {
     *  type : 'bordered', // see the prop of VideoRow
     *  values : [
     *    {
     *      videoId : 3,
     *      index : [0,3]
     *    }
     *  ]
     */
    const selected = getNextSelected(this.state.selected, info, true, SELECTED_TYPE.CHECKED);
    if (selected.values.length > 0) {
      this.updateMode(MODES.MULTIPLE);
      this.updateSelected(selected);
    } else {
      this.resetToDefault();
    }
  };

  handleCloseBtnClick = () => {
    this.resetToDefault();
  };

  /**
   *
   * @param info
   * const info = {
        videoId : ${video_id},
        index : ${next_selected_index],
        selected : true,
      };
   */
  handleSelectChange = (info) => {
    this.handleImageClick(info);
  };

  handleAdCreate = (ad) => {
    adsApi.createAd(ad)
      .then((res) => {
        const data = res.response_data;
        const newAd = new Ad(data.ads[0].video_id, data.ads[0].content[0]);
        const existedAd = this.state.ads.find(a => a.id() === newAd.id());
        if (!existedAd) {
          const ads = this.state.ads.slice();
          ads.push(newAd);
          this.setState({
            ads,
          });
        }
      })
      .catch((ex) => {
        LogUtil.debug(`Create ad failed: ${ex}`);
      });
  };

  handleAdDelete = (id) => {
    adsApi.deleteAd(id)
      .then((res) => {
        const ids = [];
        const ads = res.response_data.ads;
        Object.keys(ads).forEach(videoId =>
          Array.prototype.push.apply(ids, ads[videoId])
        );

        this.setState({
          ads: this.state.ads.filter(ad => !ids.includes(ad.id())),
        });
      })
      .catch((ex) => {
        LogUtil.debug(`Delete ad failed: ${ex}`);
      });
  };


  updateMode = (mode) => {
    this.setState({ mode });
  };

  updateSelected = (selected) => {
    this.setState({ selected });
  };

  resetToDefault = () => {
    this.setState(getDefaultState(this.state));
  };

  queryFormsAndCategories = (locale) => {
    this.props.requestAdCategories(locale);
    this.props.requestAdForms(locale);
  };

  queryAds = (videoIds) => {
    adsApi.getAdsV2(this.props.campaignId, videoIds)
      .then((res) => {
        const ads = [];
        const data = res.response_data;
        for (const ad of data.ads) {
          for (const content of ad.content) {
            ads.push(new Ad(ad.video_id, content));
          }
        }
        this.setState({
          ads,
        });
      })
      .catch((ex) => {
        LogUtil.log(`AdSetting queryAds() failed, ex=${ex}`);
      });
  };

  handleBatchCreate = (filterId, formId) => {
    const form = this.props.adForms.find(f => f.id() === formId);
    const ads = [];
    const videoIds = videosToIdArray(this.props.videos);
    if (this.state.isAll) {
      this.props.showLoading();
      this.props.onCreateAllAds(filterId, formId)
        .then(() => {
          this.props.hideLoading();
          this.props.setMessage(this.props.t('setSuccess'), true);
          this.resetToDefault();
          this.queryAds(videoIds);
        })
        .catch((ex) => {
          LogUtil.log(ex);
          this.props.hideLoading();
          this.props.alert(this.props.t('request_failed_message'));
        });
    }

    if (!this.state.isAll && form) {
      for (const selected of this.state.selected.values) {
        const video = this.props.videos.find(v => v.video_id === selected.videoId);
        if (video) {
          const offset = form.duration() * video.video_fps;
          const chances = video.chances.filter((chance, index) => selected.index.includes(index));
          const fps = video.video_fps;
          for (const chance of chances) {
            const startPosition = helper.timeStringToFrame(
              helper.startPosToTimeString(chance.start, fps),
              fps);
            ads.push({
              video_id: video.video_id,
              video_fps: video.video_fps,
              content: {
                campaign_id: this.props.campaignId,
                start_position: startPosition,
                end_position: startPosition + offset,
                thumbnail: chance.thumbnail,
                tag_infos: chance.tag_infos,
                filter_id: filterId,
                form: formId,
                org_start_position: chance.start,
                org_end_position: chance.end,
              },
            });
          }
        }
      }
    }

    if (!this.state.isAll && ads.length > 0) {
      this.props.showLoading();
      adsApi.createAd(ads)
        .then((res) => {
          const newAds = this.state.ads.slice();
          for (const ad of res.response_data.ads) {
            const videoId = ad.video_id;
            for (const content of ad.content) {
              const newAd = new Ad(videoId, content);
              ads.push(newAd);
            }
          }
          this.setState({
            ads: newAds,
          });
          this.resetToDefault();
          this.props.hideLoading();
          this.props.setMessage(this.props.t('setSuccess'), true);
          this.queryAds(videoIds);
        })
        .catch((ex) => {
          this.props.hideLoading();
          LogUtil.debug(`Batch create ads failed: ${ex}`);
        });
    }
  };

  handlePageChange = (nextPage) => {
    this.props.showLoading(this.props.t('searching'));
    this.props.onPageChange(
      nextPage,
    )
      .then(() => {
        this.setState({
          ...getDefaultState(this.state),
          activePage: nextPage,
        });
        this.props.hideLoading();
        scrollNodeIntoView(this.topAnchor);
      })
      .catch((ex) => {
        this.props.hideLoading();
        LogUtil.debug(`Query ad chance failed, ex = ${ex}`);
        this.props.alert(this.props.t('request_failed_message'));
      });
  };

  handleVideoCheckboxChange = (checked, videoId) => {
    const { selected, disabledList } = this.state;
    const { videos } = this.props;
    const nextSelected = R.clone(selected);
    const indexInSelect = selected.values.findIndex(video => video.videoId === videoId);
    const indexInDisabled = disabledList.findIndex(video => video.videoId === videoId);

    if (!checked) {
      nextSelected.values.splice(indexInSelect, 1);
    } else {
      const videoIx = videos.findIndex(video => video.video_id === videoId);
      let selectedIndexArr = (
        Array(videos[videoIx].chances.length).fill(0).map((ad, index) => index)
      );

      if (indexInDisabled >= 0) {
        const disabledIndexArr = disabledList[indexInDisabled].index;
        selectedIndexArr = selectedIndexArr.filter(value => disabledIndexArr.indexOf(value) < 0);
      }

      if (indexInSelect < 0) {
        nextSelected.values.push(
          {
            videoId,
            index: selectedIndexArr,
          }
        );
      } else {
        nextSelected.values[indexInSelect].index = selectedIndexArr;
      }
    }

    this.setState({
      selected: nextSelected,
      mode: nextSelected.values.length > 0 ? MODES.MULTIPLE : MODES.DEFAULT,
    });
  };

  pauseVideo() {
    if (this.state.mode === MODES.SINGLE && this.rowsRef) {
      this.rowsRef.forEach((node) => {
        if (node) {
          node.pauseVideo();
        }
      });
    }
  }

  handleAllAdsCheck = (checked) => {
    const { videos } = this.props;
    const { disabledList } = this.state;
    if (!checked) {
      this.resetToDefault();
    } else {
      const nextSelected = Object.assign({}, this.state.selected);
      nextSelected.values = videos.map((v) => {
        let indexs = [...Array(v.chances.length).keys()];
        const videoInDisable = disabledList.find(video => video.videoId === v.video_id);
        if (videoInDisable) {
          indexs = indexs.filter(i => videoInDisable.index.indexOf(i) < 0);
        }
        return {
          videoId: v.video_id,
          index: indexs,
        };
      });

      this.setState({
        selected: nextSelected,
        mode: MODES.MULTIPLE,
      });
    }
  };

  handleSelectAll = () => {
    this.setState({
      isAll: true,
      selected: getDefaultSelected(),
      mode: MODES.MULTIPLE,
    });
  };

  requestFeedbackApi = (payload, setStateFunc, count = 1, reset = true) =>
    feedbackToHrsApi(payload)
      .then(() => {
        this.setState(setStateFunc);
        if (reset) {
          this.resetToDefault();
        }
        this.props.setMessage(
          this.props.t('feedback_numbers_of_tags_to_wrong', {
            count,
          })
        );
      })
      .catch(() => {
        const {
          toHide,
          toShow,
          switchContent,
        } = this.modal;
        switchContent(
          <FailFeedbackHrs
            toHide={toHide}
          />
        );
        toShow();
      });

  handleOnReport = count => () => {
    const {
      toHide,
    } = this.modal;
    this.modal.switchContent(
      <ReportWrongTags
        count={count}
        onKeep={toHide}
        onReport={() => {
          toHide();
          const payload = {
            data: getFeedbackData(this.state.selected.values, this.props.videos),
          };

          return this.requestFeedbackApi(payload, mergeDisabledList, count, true);
        }}
      />
    );
    this.modal.toShow();
  }

  render() {
    const { videos, totalVideos, t } = this.props;
    const { selected, disabledList } = this.state;
    const showStartSearchPlaceholder = !this.props.isSearchEmpty && totalVideos === 0;
    return (
      <div
        styleName={this.state.isAll ? 'container-overlay' : 'container'}
      >
        <SummaryActionBar
          totalChances={this.props.totalChances}
          totalVideos={this.props.totalVideos}
          onSelectAll={this.handleSelectAll}
          campaignId={this.props.campaignId}
          hideSummary={showStartSearchPlaceholder}
          hideSelectAll={showStartSearchPlaceholder}
          disableSelectAll={this.props.isSearchEmpty}
        />
        <HorizontalDivider />
        {
          this.props.isSearchEmpty ?
            <SearchEmptyMessage
              message1={this.props.t('noMatchedAds')}
              message2={this.props.t('adjustSearchCriteria')}
            />
            :
            null
        }
        {
          showStartSearchPlaceholder ?
            <EmptyPlaceholder
              placeholder={this.props.t('adSettingEmptyPlaceholder')}
            />
            :
            null
        }
        {
          totalVideos > 0 ?
            (
              <div styleName="summary-paging-container">
                <Paging
                  activePage={this.state.activePage}
                  onPrev={this.handlePageChange}
                  onNext={this.handlePageChange}
                  totalVideos={totalVideos}
                  pageLimit={AD_SEARCH_LIMIT}
                  disabled={this.state.mode === MODES.MULTIPLE}
                />
              </div>
            ) :
            null
        }
        {
          videos && videos.length > 0 ?
            (
              <div
                styleName={this.state.mode === MODES.MULTIPLE ? 'result-container-w-dock' : 'result-container'}
              >
                <div styleName="header-container">
                  <Checkbox
                    checked={isAllAdsSelected(videos, selected, disabledList)}
                    disabled={this.state.mode === MODES.SINGLE
                            || alldisabled(videos, disabledList)}
                    onChange={this.handleAllAdsCheck}
                  />
                  <div styleName="header-name">{t('selectCurrentPage')}</div>
                </div>
                <div onScroll={forceCheck}>
                  <ListView
                    elements={this.getVideoComponents()}
                    divider
                  />
                </div>
              </div>
            )
            :
            null
        }
        <Modal ref={(node) => { this.modal = node; }} headerHide />
        {
          this.state.mode === MODES.MULTIPLE ?
            <BatchActionFloatBar
              adNumber={this.getAdNumber()}
              onCancelSelect={() => { this.resetToDefault(); }}
              adCategories={this.props.adCategories}
              adForms={this.props.adForms}
              hideDelete
              hideDownload
              showReport={!this.state.isAll}
              onBatchUpdate={this.handleBatchCreate}
              onReport={this.handleOnReport(this.getAdNumber())}
              defaultCategory={this.props.defaultCategory}
              locale={this.props.locale}
            />
            :
            <span />
        }
      </div>
    );
  }
}

const isAllAdsSelected = (videos, selected, disabledList) => {
  let sum1 = 0;
  let sum2 = 0;
  let sum3 = 0;

  videos.forEach((v) => {
    sum1 += v.chances.length;
  });

  selected.values.forEach((v) => {
    sum2 += v.index.length;
  });

  disabledList.forEach((v) => {
    sum3 += v.index.length;
  });

  if (sum1 === sum3) {
    return false;
  }
  return sum1 === sum2 + sum3;
};

const getDefaultSelected = (type = 'checked') => ({
  type,
  values: [],
});

const videosToIdArray = videos => videos.map(v => v.video_id);

AdSetting.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      video_id: PropTypes.number,
      video_name: PropTypes.string,
      video_fps: PropTypes.number,
      video_url: PropTypes.string,
      chances: PropTypes.arrayOf(
        PropTypes.shape({
          start: PropTypes.number,
          end: PropTypes.number,
          category: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
          ]),
          filter_id: PropTypes.string,
          thumbnail: PropTypes.string,
          tags: PropTypes.arrayOf(PropTypes.number),
        })
      ),
    })
  ), // mark
  t: PropTypes.func,
  locale: PropTypes.string, // mark
  adCategories: PropTypes.array.isRequired, // mark
  adForms: PropTypes.array.isRequired, // mark
  totalVideos: PropTypes.number, // mark
  isSearchEmpty: PropTypes.bool, // mark
  searchConfig: PropTypes.object, // mark
  brands: PropTypes.array,
  totalChances: PropTypes.number, // mark
  defaultPage: PropTypes.number, // mark
  defaultCategory: PropTypes.string, // mark
  // actions
  requestAdCategories: PropTypes.func.isRequired,
  requestAdForms: PropTypes.func.isRequired,
  showLoading: PropTypes.func,
  hideLoading: PropTypes.func,
  alert: PropTypes.func,
  onPageChange: PropTypes.func,
  onCreateAllAds: PropTypes.func,
  setMessage: PropTypes.func,
  campaignId: PropTypes.number.isRequired,
  searchHash: PropTypes.string,
};


export default localize(CSSModules(AdSetting, AdPodStyle));
