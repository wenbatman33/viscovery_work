import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { Interpolate } from 'react-i18next';
import LazyLoad from 'react-lazyload';
import { Carousel } from 'vidya/Others';
import { Checkbox } from 'vidya/Form';

import AdEditor from './AdEditor';
import styles from './VideoRow.scss';
import AdCard from '../AdCard';
import { helper } from '../AdPodManagement';
import vPlaceholder from '../../assets/ad_holder.png';

import {
  findBrandById,
  getTagNameByLocale,
  connectApiConfig,
} from '../../utils';

const checkAllSelected = (selectedItems, disabledItems, chances) => {
  if (chances.length === disabledItems.length) {
    return false;
  }
  return selectedItems.length + disabledItems.length === chances.length;
};

class VideoRow extends React.PureComponent {

  componentDidUpdate() {
    this.checkCarouselViewport();
  }

  getTagNames = (chance) => {
    const tags = chance.tag_infos;
    const names = tags.map(tag =>
      getTagNameByLocale(findBrandById(this.props.brands, tag.tag_id), this.props.locale)
    );
    return names.toString();
  };

  handleCloseBtnClick = () => {
    this.props.onCloseClick(this.props.video.video_id);
  };

  /**
   * @param selectIndex next selected item index
   */
  handleSelectChange = (selectIndex) => {
    if (this.props.onSelectChange) {
      const info = {
        videoId: this.props.video.video_id,
        index: selectIndex,
        selected: true,
      };
      this.props.onSelectChange(info);
      const viewRange = this.carousel.getViewPortRange();
      if (selectIndex < viewRange.start) { this.carousel.handleLeft(); }

      if (selectIndex > viewRange.end) { this.carousel.handleRight(); }
    }
  };

  handleAdCreate = (videoId, startFrame, endFrame, thumbnail, tagIds, categoryId, formId) => {
    const { onAdCreate } = this.props;
    if (onAdCreate) {
      onAdCreate(videoId, startFrame, endFrame, thumbnail, tagIds, categoryId, formId);
    }
  };

  handleAdDelete = (id) => {
    const { onAdDelete } = this.props;
    if (onAdDelete) {
      onAdDelete(id);
    }
  };

  handleCheckboxChange = (checked) => {
    this.props.onSelectAll(checked, this.props.video.video_id);
  };

  pauseVideo = () => {
    if (this.editor) {
      const player = this.editor.getPlayer();
      if (player) {
        player.pause();
      }
    }
  };

  checkCarouselViewport = () => {
    clearTimeout(this.carouselTimer);
    this.carouselTimer = setTimeout(
      () => {
        if (this.carousel && this.carousel.getViewPortRange() == null) {
          this.carousel.handleLeft();
        }
      }
      , 500);
  };

  render() {
    const {
      video,
      t,
      selected,
      disableHover,
      ads,
      adCategories,
      adForms,
      disableCheckbox,
      disabledList,
    } = this.props;

    const selectedIndexArr = [];
    const disabledListByRow = [];

    video.chances.forEach((chance, index) => {
      if (isChanceSelected(selected, video.video_id, index)) { selectedIndexArr.push(index); }
      if (isDisabled(disabledList, video.video_id, index)) { disabledListByRow.push(index); }
    });

    const blocks = video.chances.map((chance, index) =>
      <div
        key={index}
        style={{
          display: 'inline-block',
          padding: '1px 0',
        }}
      >
        <AdCard
          key={index}
          ad={chance}
          imgSrc={chance.thumbnail
            ? helper.addHostPrefix(chance.thumbnail, this.props.imgHost)
            : vPlaceholder
          }
          disableHover={disableHover}
          onCheckBoxClick={this.props.onCheckBoxClick}
          onImageClick={this.props.onImageClick}
          videoId={video.video_id}
          index={index}
          selectType={selected.type}
          onTextClick={this.props.onBtnClick}
          time={helper.startPosToTimeString(chance.start, video.video_fps)}
          selected={selectedIndexArr.indexOf(index) > -1}
          disabled={disabledListByRow.indexOf(index) > -1}
          videoFps={video.video_fps}
          tagNames={this.getTagNames(chance)}
        />
      </div>
    );

    return (
      <div
        styleName="root-container"
      >
        <div styleName="info-container">
          <Checkbox
            checked={!disableCheckbox &&
                      checkAllSelected(selectedIndexArr, disabledListByRow, video.chances)}
            disabled={disableCheckbox || (disabledListByRow.length === video.chances.length)}
            onChange={this.handleCheckboxChange}
          />
          <div styleName="video-name" title={video.video_name}>{video.video_name}</div>
          <div styleName="video-status">
            <Interpolate i18nKey="num_of_ad_chances" chanceCount={video.chances.length} />
          </div>
        </div>
        {
          this.props.showEditor && selectedIndexArr.length > 0 ?
            <AdEditor
              ref={(node) => { this.editor = node; }}
              video={video}
              ads={ads}
              adCategories={adCategories}
              adForms={adForms}
              defaultCategory={this.props.defaultCategory}
              onEditorClose={this.handleCloseBtnClick}
              selected={selectedIndexArr[0]}
              onSelect={this.handleSelectChange}
              onCreate={this.handleAdCreate}
              onDelete={this.handleAdDelete}
              t={t}
              brands={this.props.brands}
              locale={this.props.locale}
              videoHost={this.props.videoHost}
              requestFeedbackApi={this.props.requestFeedbackApi}
              disabled={disabledListByRow.indexOf(selectedIndexArr[0]) > -1}
              campaignId={this.props.campaignId}
            />
            : null
        }
        <div styleName="block-container">
          <LazyLoad height="100%">
            <Carousel
              ref={(node) => { this.carousel = node; }}
            >
              {blocks}
            </Carousel>
          </LazyLoad>
        </div>
      </div>
    );
  }
}

const isChanceSelected = (selected, videoId, chanceIx) => {
  const item = selected.values.find(_item => _item.videoId === videoId);
  if (!item) {
    return false;
  }

  const foundIx = item.index.indexOf(chanceIx);

  return !(foundIx < 0);
};

const isDisabled = (disabledList, videoId, chanceIx) => {
  const item = disabledList.find(_item => _item.videoId === videoId);
  if (!item) {
    return false;
  }

  const foundIx = item.index.indexOf(chanceIx);

  return !(foundIx < 0);
};

VideoRow.propTypes = {
  video: PropTypes.shape({
    video_id: PropTypes.number,
    video_name: PropTypes.string,
    video_fps: PropTypes.number,
    video_url: PropTypes.string,
    chances: PropTypes.arrayOf(
      PropTypes.shape({
        start: PropTypes.number,
        end: PropTypes.number,
        thumbnail: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.number),
      })
    ),
  }),
  selected: PropTypes.shape({
    type: PropTypes.oneOf(['checked', 'bordered']),
    values: PropTypes.arrayOf(
      PropTypes.shape({
        videoId: PropTypes.number,
        index: PropTypes.arrayOf(PropTypes.number),
      })
    ),
  }),
  disabledList: PropTypes.arrayOf(
    PropTypes.shape({
      videoId: PropTypes.number,
      index: PropTypes.arrayOf(PropTypes.number),
    })
  ),
  onImageClick: PropTypes.func.isRequired,
  onCheckBoxClick: PropTypes.func.isRequired,
  onBtnClick: PropTypes.func.isRequired,
  adCategories: PropTypes.array,
  adForms: PropTypes.array,
  ads: PropTypes.array,
  hideClose: PropTypes.bool, // the close button to exit single edit mote
  onCloseClick: PropTypes.func,
  disableHover: PropTypes.bool, // disable hover dim and show check box effect
  showEditor: PropTypes.bool,
  onSelectChange: PropTypes.func,
  onAdCreate: PropTypes.func,
  onAdDelete: PropTypes.func,
  t: PropTypes.func,
  defaultCategory: PropTypes.string,
  brands: PropTypes.array,
  disableCheckbox: PropTypes.bool,
  onSelectAll: PropTypes.func,
  locale: PropTypes.string,
  imgHost: PropTypes.string,
  videoHost: PropTypes.string,
  requestFeedbackApi: PropTypes.func,
  campaignId: PropTypes.number,
};


export default connectApiConfig(CSSModules(VideoRow, styles));
