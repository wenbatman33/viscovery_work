import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';
import { forceCheck } from 'react-lazyload';

import { LogUtil } from 'utils';
import { ListView, HorizontalDivider } from 'vidya';
import { Modal } from 'vidya/Dialogs';
import { Checkbox } from 'vidya/Form';

import styles from './AdPod.scss';
import {
  AD_POD_LIMIT,
} from '../../constants';

import Paging from './Paging';
import SummaryActionBar from './SummaryActionBar';

import VideoRow from './VideoRow';
import BatchDeleteForm from '../BatchDeleteForm';
import SingleDeleteForm from './SingleDeleteForm';
import BatchActionFloatBar from '../BatchActionFloatBar';
import EmptyPlaceholder from './EmptyPlaceholder';
import SearchEmptyMessage from './SearchEmptyMessage';
import BatchDeleteTitle from './BatchDeleteTitle';

import * as helper from './helper';
import { adsApi } from '../../api';
import {
  getNextSelected,
  scrollNodeIntoView,
  totalPageNum,
} from '../../utils';

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

class AdPodManagement extends React.Component {
  state = {
    ...getDefaultState(),
  };

  componentDidMount() {
    this.props.requestAdForms();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.activePage !== nextProps.activePage) {
      this.resetToDefault();
    } else if (
      !Object.is(this.props.videos, nextProps.videos) &&
      this.state.mode !== MODES.DEFAULT) {
      this.resetToDefault();
    }
  }

  getVideoComponents = () => {
    const { selected } = this.state;
    const { videos } = this.props;
    let rows = [];
    const elements = [];
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
      onBtnClick: this.handleTypeBtnClick,
      onCheckBoxClick: this.handleCheckBoxClick,
      selected: this.state.selected,
      adCategories: this.props.adCategories,
      adForms: this.props.adForms,
      t: this.props.t,
      onDelete: this.showDeleteConfirm,
      onSelectAll: this.handleVideoCheckboxChange,
      locale: this.props.locale,
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
              hideClose={
                selected.values.findIndex(item => item.videoId === video.video_id) < 0
              }
              showEditor
              onSelectChange={this.handleSelectChange}
              onCloseEditor={this.resetToDefault}
              onAdUpdate={this.requestUpdateAd}
              {...common}
              disableCheckbox
              selected={values.length ? Object.assign({}, selected, { values }) : NO_SELECTED}
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

  handleTypeBtnClick = (info) => {
    if (this.state.mode === MODES.MULTIPLE) { return; } // do nothing

    const selected = getNextSelected(this.state.selected, info, false, SELECTED_TYPE.BORDERED);
    this._updateModeAndSelected(MODES.SINGLE, selected);
  };


  resetToDefault = () => {
    this.setState(getDefaultState());
  };

  _updateModeAndSelected = (mode, selected) => {
    if (selected.values.length === 0) {
      this.resetToDefault();
    } else {
      this.setState({
        mode: mode || this.state.mode,
        selected: selected || this.state.selected,
      });
    }
  };

  handleSelectChange = (info) => {
    this.handleImageClick(info);
  };

  handleVideoCheckboxChange = (checked, videoId) => {
    const { selected } = this.state;
    const { videos } = this.props;
    let nextSelected = null;
    if (!checked) {
      nextSelected = helper.removeSelectedByVideoId(selected, videoId);
    } else {
      nextSelected = helper.addSelectedByVideoId(selected, videos, videoId);
    }
    this.setState({
      selected: nextSelected,
      mode: nextSelected.values.length > 0 ? MODES.MULTIPLE : MODES.DEFAULT,
    });
  };

  // delete one ad
  showDeleteConfirm = (video, index) => {
    const content = (
      <SingleDeleteForm
        t={this.props.t}
        onCancel={() => { this.modal.toHide(); }}
        onConfirm={() => {
          this.modal.toHide();
          this._doDeleteAd(video, index);
        }}
      />
    );
    this.modal.switchContent(content);
    this.modal.toShow();
  };

  _doDeleteAd = (video, adIndex) => {
    const videoId = video.video_id;
    const adId = video.content[adIndex].id;
    const videoAdLength = video.content.length;
    const totalPage = totalPageNum(this.props.totalVideos, AD_POD_LIMIT);
    const pageAdCount = helper.getPageAdsCount(this.props.videos);

    this.props.requestDeleteAd(videoId, adId)
      .then(() => {
        if (pageAdCount === 1) {
          this.handlePageChange(
            this.props.activePage >= totalPage ?
              totalPage - 1 :
              this.props.activePage
          );
        } else if (videoAdLength === 1) {
          this.resetToDefault();
        } else {
          this.handleImageClick({
            videoId: video.video_id,
            index: adIndex + 1 === videoAdLength ? adIndex - 1 : adIndex,
            selected: true,
          });
        }
      })
      .catch((ex) => {
        LogUtil.log(ex);
        this.props.showAlert(this.props.t('request_failed_message'));
      });
  };

  requestBatchDelete = (adIdArray, successHandler) => {
    if (Array.isArray(adIdArray)) {
      const all = this.state.isAll;
      const { campaignId, searchConfig } = this.props;
      const videoIds = searchConfig.videosIds;
      const filterIDs = searchConfig.filterIds;
      const startTime = searchConfig.startTime;
      const endTime = searchConfig.endTime;

      this.showLoading();
      this.props.requestDeleteAds(
        campaignId, adIdArray, videoIds, filterIDs, startTime, endTime, all)
        .then((action) => {
          this.props.hideLoading();

          if (successHandler && typeof successHandler === 'function') {
            successHandler(action.ads, all);
          }
        })
        .catch((ex) => {
          this.props.hideLoading();
          LogUtil.log('AdPodManagement, delete ads failed');
          LogUtil.log(ex);
          this.props.showAlert(this.props.t('request_failed_message'));
        });
    } else {
      LogUtil.debug('AdPodManagement, argument "adIdArray" must be of type array.');
    }
  };

  requestUpdateAd = (ad) => {
    if (ad) {
      this.props.requestUpdateAd(ad.id, JSON.stringify(ad))
        .then(() => {
          this.handleReload();
        })
        .catch((ex) => {
          this.props.showAlert(this.props.t('request_failed_message'));
          LogUtil.debug(`Update ad failed , message = ${ex}`);
        });
    } else {
      LogUtil.debug('requestUpdateAd(), missing argument.');
    }
  };

  handleCheckBoxClick = (info) => {
    const nextSelected = getNextSelected(this.state.selected, info);
    this._updateModeAndSelected(MODES.MULTIPLE, nextSelected);
  };

  /**
   * @param info {videoId : Number, index : Number, selected : Boolean }
   */
  handleImageClick = (info) => {
    let selected = null;

    switch (this.state.mode) {
      case MODES.DEFAULT:
      case MODES.SINGLE:
        selected = getNextSelected(this.state.selected, info, false, SELECTED_TYPE.BORDERED);
        this.setState({
          mode: MODES.SINGLE,
          selected,
        });
        break;
      case MODES.MULTIPLE:
        selected = getNextSelected(this.state.selected, info, true, SELECTED_TYPE.CHECKED);
        if (selected.values.length > 0) {
          this._updateModeAndSelected(MODES.MULTIPLE, selected);
        } else {
          this.resetToDefault();
        }
        break;
      default:
        break;
    }
  };

  handleSelectedAdsDelete = () => {
    const adIDs = helper.adIDsFromSelected(this.props.videos, this.state.selected);
    const adNumber = this.state.isAll ? this.props.totalAdCount : adIDs.length;
    const pageAdCount = helper.getPageAdsCount(this.props.videos);
    const currentTotalPage = totalPageNum(this.props.totalVideos, AD_POD_LIMIT);

    const successHandler = (ads, isAll) => {
      this.resetToDefault();
      if (!isAll) {
        const removedAdCount = helper.deleteAdsCountFromResp(ads);

        if (pageAdCount === removedAdCount && currentTotalPage > 1) {
          this.handlePageChange(
            this.props.activePage === currentTotalPage ?
              this.props.activePage - 1 :
              this.props.activePage
          );
        }
      }
    };

    const titleComponent = (
      <BatchDeleteTitle
        adNumber={adNumber}
      />
    );

    const content = (
      <BatchDeleteForm
        title={titleComponent}
        message={this.props.t('batch_delete_check_1')}
        onCancel={() => { this.modal.toHide(); }}
        onConfirm={
          () => {
            this.modal.toHide();
            this.requestBatchDelete(adIDs, successHandler);
          }
        }
      />
    );
    this.modal.switchContent(content);
    this.modal.toShow();
  };

  handleBatchAdUpdate = (filterId, formId) => {
    const { campaignId } = this.props;
    const successHandler = () => {
      this.resetToDefault();
      this.handleReload();
    };
    const failHandler = (ex) => {
      this.props.hideLoading();
      this.props.showAlert(this.props.t('request_failed_message'));
      LogUtil.debug(`Update selected ads failed , message = ${(ex.response && ex.response.message) || ex}`);
    };

    this.showLoading();
    if (this.state.isAll === true) {
      const { videosIds, filterIds, startTime, endTime } = this.props.searchConfig;
      this.props.requestUpdateAds(
        campaignId,
        null,
        true,
        videosIds,
        filterIds,
        startTime,
        endTime,
        {
          filter_id: filterId,
          form: formId,
        }
      )
      .then(successHandler, failHandler);
    } else {
      const adIDs = helper.adIDsFromSelected(this.props.videos, this.state.selected);
      const contents = helper.getAdContentsByIDs(this.props.videos, adIDs);
      const newContents = contents.map((content) => {
        const newContent = Object.assign({}, content);
        newContent.filter_id = filterId;
        newContent.form = formId;
        return newContent;
      });

      const adsContentStr = JSON.stringify(newContents.map(helper.convertToBatchUpdateFormat));

      this.props.requestUpdateAds(campaignId, adsContentStr)
        .then(successHandler, failHandler);
    }
  };

  handlePageChange = (targetPage) => {
    const { campaignId, searchConfig: config } = this.props;
    const offset = (targetPage - 1) * AD_POD_LIMIT;

    this.props.showLoading();
    this.props.requestAds(
      campaignId,
      config.videosIds,
      config.subcategoryIds,
      config.filterIds,
      offset,
      config.limit,
      config.startTime,
      config.endTime
    )
    .then(() => {
      scrollNodeIntoView(this.topAnchor);
      this.props.hideLoading();
    })
    .catch(() => {
      this.props.hideLoading();
      this.props.showAlert(this.props.t('request_failed_message'));
    });
  };

  handleAllAdsCheck = (checked) => {
    const { videos } = this.props;
    if (!checked) {
      this.setState(getDefaultState());
    } else {
      const nextSelected = Object.assign({}, this.state.selected);
      nextSelected.values = videos.map(v => ({
        videoId: v.video_id,
        index: [...Array(v.content.length).fill(0).keys()],
      }));

      this.setState({
        selected: nextSelected,
        mode: MODES.MULTIPLE,
      });
    }
  };

  handleDownloadClick = () => {
    const { campaignId, searchConfig } = this.props;
    const { isAll } = this.state;
    const adIDs = isAll ? null : helper.adIDsFromSelected(this.props.videos, this.state.selected);

    this.showLoading();
    adsApi.downloadAds(
      campaignId,
      this.state.isAll,
      adIDs,
      searchConfig.filterIds,
      searchConfig.startTime,
      searchConfig.endTime,
    )
    .then((res) => {
      this.props.hideLoading();
      if (res.status === 204) {
        this.props.showAlert(this.props.t('204 NO CONTENT'));
      } else {
        const downloadLink = res.response_data.download_link;
        const fileName = downloadLink.split('/').pop() || 'vad.zip';
        helper.downloadVad(downloadLink, fileName);
      }
      this.resetToDefault();
    })
    .catch((ex) => {
      LogUtil.debug(`Download ads failed, ex=${ex}`);
      this.props.hideLoading();
      this.props.showAlert(this.props.t('downloadFailed'));
    });
  };

  handleExport = () => {
    const { campaignId, searchConfig } = this.props;
    const { isAll } = this.state;
    const adIDs = isAll ? null : helper.adIDsFromSelected(this.props.videos, this.state.selected);

    this.showLoading();

    adsApi.exportAds(
      campaignId,
      this.state.isAll,
      adIDs,
      searchConfig.filterIds,
      searchConfig.startTime,
      searchConfig.endTime
    )
      .then(() => {
        this.props.hideLoading();
        this.props.showAlert(this.props.t('publishSuccess'));
        this.resetToDefault();
      })
      .catch((ex) => {
        LogUtil.debug(`Export ads failed, ex=${ex}`);
        this.props.hideLoading();
        this.props.showAlert(this.props.t('publishFailMessage'));
      });
  };

  handleSelectAll = () => {
    this.setState({
      isAll: true,
      selected: getDefaultSelected(),
      mode: MODES.MULTIPLE,
    });
  };

  showLoading = (message) => {
    this.props.showLoading(message || this.props.t('processingPleaseWait'));
  };

  handleReload = () => {
    const { campaignId, searchConfig: config, t } = this.props;

    this.props.showLoading();
    this.props.requestAds(
      campaignId,
      config.videosIds,
      config.subcategoryIds,
      config.filterIds,
      0,
      config.limit,
      config.startTime,
      config.endTime
    )
      .then(() => {
        scrollNodeIntoView(this.topAnchor);
        this.props.hideLoading();
        this.props.setMessage(t('updateSuccess'));
      })
      .catch(() => {
        this.props.hideLoading();
        this.props.showAlert(this.props.t('request_failed_message'));
      });
  };

  render() {
    const { campaignId, isSearchEmpty, totalVideos, totalAdCount, videos, t } = this.props;
    const { selected } = this.state;
    const showStartSearchPlaceholder = !isSearchEmpty && totalVideos === 0;

    return (
      <div
        styleName={this.state.isAll ? 'container-overlay' : 'container'}
      >
        <SummaryActionBar
          totalAds={totalAdCount}
          totalVideos={totalVideos}
          onSelectAll={this.handleSelectAll}
          campaignId={campaignId}
          hideSummary={showStartSearchPlaceholder}
          hideSelectAll={showStartSearchPlaceholder}
          disableSelectAll={isSearchEmpty}
        />
        <HorizontalDivider />
        {isSearchEmpty
          ? (
            <SearchEmptyMessage
              message1={this.props.t('noMatchedAds')}
              message2={this.props.t('adjustSearchCriteria')}
            />
          )
          : null
        }
        {showStartSearchPlaceholder
          ? <EmptyPlaceholder placeholder={t('empty_ads_placeholder2')} />
          : null
        }
        {totalVideos > 0
          ? (
            <div styleName="summary-paging-container">
              <Paging
                activePage={this.props.activePage}
                onPrev={this.handlePageChange}
                onNext={this.handlePageChange}
                totalVideos={this.props.totalVideos}
                pageLimit={AD_POD_LIMIT}
                disabled={this.state.mode === MODES.MULTIPLE}
              />
            </div>
          )
          : null
        }
        {
          videos && videos.length > 0 ?
            (
              <div
                styleName={this.state.mode === MODES.MULTIPLE ? 'result-container-w-dock' : 'result-container'}
              >
                <div styleName="header-container">
                  <Checkbox
                    checked={isAllAdsSelected(videos, selected)}
                    disabled={this.state.mode === MODES.SINGLE}
                    onChange={this.handleAllAdsCheck}
                  />
                  <div styleName="header-name">{t('selectCurrentPage')}</div>
                  <div styleName="header-time">{t('update_time')}</div>
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
              adNumber={
                this.state.isAll ?
                totalAdCount :
                helper.getSelectedNumber(selected)
              }
              onCancelSelect={() => { this.resetToDefault(); }}
              adCategories={this.props.adCategories}
              adForms={this.props.adForms}
              onBatchUpdate={this.handleBatchAdUpdate}
              onDelete={this.handleSelectedAdsDelete}
              locale={this.props.locale}
              showExport={!this.props.disableExport}
              onExport={this.handleExport}
              onDownload={this.handleDownloadClick}
            />
            :
            <span />
        }
      </div>
    );
  }
}

const getDefaultState = () => (
  {
    mode: MODES.DEFAULT,
    selected: getDefaultSelected(),
    isAll: false,
  }
);

const getDefaultSelected = () => ({
  type: 'checked',
  values: [],
});

const isAllAdsSelected = (videos, selected) => {
  const sum1 = helper.getPageAdsCount(videos);
  let sum2 = 0;

  selected.values.forEach((v) => {
    sum2 += v.index.length;
  });

  return sum1 === sum2;
};

AdPodManagement.contextTypes = {
  router: PropTypes.object.isRequired,
};
AdPodManagement.propTypes = {
  t: PropTypes.func,
  campaignId: PropTypes.number.isRequired,
  adCategories: PropTypes.array.isRequired,
  adForms: PropTypes.array.isRequired,
  requestAdCategories: PropTypes.func,
  requestAdForms: PropTypes.func,
  requestDeleteAds: PropTypes.func,
  requestDeleteAd: PropTypes.func,
  requestUpdateAd: PropTypes.func,
  requestUpdateAds: PropTypes.func,
  showLoading: PropTypes.func,
  hideLoading: PropTypes.func,
  locale: PropTypes.string,
  location: PropTypes.object,
  videos: PropTypes.array,
  totalVideos: PropTypes.number,
  totalAdCount: PropTypes.number,
  searchConfig: PropTypes.object,
  requestAds: PropTypes.func,
  isSearchEmpty: PropTypes.bool,
  showAlert: PropTypes.func,
  activePage: PropTypes.number,
  setMessage: PropTypes.func,
  disableExport: PropTypes.bool.isRequired,
};


export default CSSModules(AdPodManagement, styles);
