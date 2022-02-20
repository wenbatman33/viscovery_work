import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';
import LazyLoad from 'react-lazyload';

import { Carousel } from 'vidya/Others';
import { Checkbox } from 'vidya/Form';

import AdBlock from '../AdBlock';
import AdEditor from './AdEditor';
import {
  findCategoryNameById,
  formatAdUpdateTime,
  connectApiConfig,
} from '../../utils';
import vPlaceholder from '../../assets/ad_holder.png';
import {
  addHostPrefix,
  startPosToTimeString,
} from './helper';

import styles from './VideoRow.scss';

class VideoRow extends React.Component {

  componentDidUpdate() {
    if (this.carousel && this.carousel.getViewPortRange() === null) {
      this.carousel.handleLeft();
    }
  }

  getContainerNode = () => this.container;

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

  handleCheckboxChange = (checked) => {
    this.props.onSelectAll(checked, this.props.video.video_id);
  };

  render() {
    const { video, t, selected, adCategories, adForms, disableCheckbox } = this.props;
    const selectedIndexArr = [];
    video.content.forEach((ad, index) => {
      if (isSelected(selected, video.video_id, index)) { selectedIndexArr.push(index); }
    });

    const Blocks = video.content.map((ad, index) => (
      <div key={`${ad.id}`} style={{ display: 'inline-block' }}>
        <AdBlock
          imgSrc={ad.thumbnail ?
            addHostPrefix(ad.thumbnail, this.props.imgHost) :
            vPlaceholder
          }
          videoId={video.video_id}
          index={index}
          buttonIcon="wheel"
          buttonBackground="white"
          buttonText={
            // in case of filter_id is null, use category as well
            findCategoryNameById(adCategories, ad.filter_id || ad.category)
          }
          time={startPosToTimeString(ad.start_position, video.video_fps)}
          onImageClick={this.props.onImageClick}
          onCheckBoxClick={this.props.onCheckBoxClick}
          onBtnClick={this.props.onBtnClick}
          selectType={selected.type}
          selected={selectedIndexArr.indexOf(index) > -1}
          disableHover={this.props.disableHover}
        />
      </div>
    ));

    return (
      <div
        ref={(node) => {
          this.container = node;
        }}
      >
        <div styleName="info-action-group">
          <Checkbox
            checked={!disableCheckbox && selectedIndexArr.length === video.content.length}
            disabled={disableCheckbox}
            onChange={this.handleCheckboxChange}
          />
          <div styleName="video-name" title={video.video_name}>{video.video_name}</div>
          <div styleName="ad-number">{video.content.length}&nbsp;{t('num_of_ads')}</div>
          <div styleName="update-time">{formatAdUpdateTime(video.updated_time, this.props.locale)}</div>
        </div>
        <div>
          {
            this.props.showEditor && selectedIndexArr.length > 0 ?
              <AdEditor
                selected={selectedIndexArr[0]}
                adCategories={adCategories}
                adForms={adForms}
                onSelect={this.handleSelectChange}
                t={t}
                video={video}
                onClose={this.props.onCloseEditor}
                onDelete={this.props.onDelete}
                onUpdate={this.props.onAdUpdate}
                locale={this.props.locale}
                videoHost={this.props.videoHost}
              />
              :
              <span />
          }
        </div>
        <div styleName="block-container">
          <LazyLoad height="100%">
            <Carousel
              ref={(node) => { this.carousel = node; }}
            >
              {Blocks}
            </Carousel>
          </LazyLoad>
        </div>
      </div>
    );
  }
}


const isSelected = (selected, videoId, adIx) => {
  const item = selected.values.find(_item => _item.videoId === videoId);
  if (!item) {
    return false;
  }

  const foundIx = item.index.indexOf(adIx);

  return !(foundIx < 0);
};

VideoRow.propTypes = {
  t: PropTypes.func,
  video: PropTypes.shape({
    video_id: PropTypes.number,
    video_name: PropTypes.string,
    video_fps: PropTypes.number,
    gid: PropTypes.string,
    uid: PropTypes.number,
    updated_time: PropTypes.string,
    content: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        start_position: PropTypes.number,
        end_position: PropTypes.number,
        thumbnail: PropTypes.string,
        category: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),
        form: PropTypes.number,
        filter_id: PropTypes.string,
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
  onImageClick: PropTypes.func.isRequired,
  onCheckBoxClick: PropTypes.func.isRequired,
  onBtnClick: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func,
  adCategories: PropTypes.array,
  adForms: PropTypes.array,
  disableHover: PropTypes.bool,
  onCloseEditor: PropTypes.func,
  onDelete: PropTypes.func,
  onAdUpdate: PropTypes.func,
  disableCheckbox: PropTypes.bool,
  onSelectAll: PropTypes.func,
  locale: PropTypes.string,
  showEditor: PropTypes.bool,
  imgHost: PropTypes.string,
  videoHost: PropTypes.string,
};


export default connectApiConfig(CSSModules(VideoRow, styles));
