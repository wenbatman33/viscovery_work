/**
* Created Date : 2017/4/28
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.co>
* Contributor :
* Description : The display unit of a single stored ad pod. Start using this since Tag2Ad 1.5
*/
import React from 'react';
import PropTypes from 'prop-types';

import CSSModules from 'react-css-modules';
import { Interpolate } from 'react-i18next';
import LazyLoad from 'react-lazyload';

import LazyloadImage from 'vidya/Others/LazyloadImage';

import {
  CheckedIcon,
} from '../AdBlock';
import Hover from './Hover.js';

import styles from './AdCard.scss';

import FeedbackedLabed from '../FeedbackedLabel';

class AdCard extends React.PureComponent {
  state = {
    showOverlay: false,
  };

  componentWillReceiveProps() {
    this.setState({
      showOverlay: false,
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const {
  //     ad,
  //     imgSrc,
  //     disableHover,
  //     videoId,
  //     index,
  //     selectType,
  //     time,
  //     selected,
  //     disabled,
  //     hideButton,
  //     videoFps,
  //     tagNames,
  //   } = this.props;

  //   const {
  //     ad: nextAd,
  //     imgSrc: nextImgSrc,
  //     disableHover: nextDisableHover,
  //     videoId: nextVideoId,
  //     index: nextIndex,
  //     selectType: nextSelectType,
  //     time: nextTime,
  //     selected: nextSelected,
  //     disabled: nextDisabled,
  //     hideButton: nextHideButton,
  //     videoFps: nextVideoFps,
  //     tagNames: nextTagNames,
  //   } = nextProps;

  //   const {
  //     showOverlay,
  //   } = this.state;

  //   const {
  //     showOverlay: nextShowOverlay,
  //   } = nextState;

  //   if (
  //     imgSrc === nextImgSrc &&
  //     disableHover === nextDisableHover &&
  //     videoId === nextVideoId &&
  //     index === nextIndex &&
  //     selectType === nextSelectType &&
  //     time === nextTime &&
  //     selected === nextSelected &&
  //     disabled === nextDisabled &&
  //     hideButton === nextHideButton &&
  //     videoFps === nextVideoFps &&
  //     tagNames === nextTagNames &&
  //     showOverlay === nextShowOverlay &&
  //     JSON.stringify(ad) === JSON.stringify(nextAd)
  //   ) {
  //     return false;
  //   }

  //   return true;
  // }

  onHoverImage = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.clearTimer();
    if (!this.props.disableHover) {
      this.showTimer = setTimeout(() => {
        this.setState({
          showOverlay: true,
        });
      }, 250);
    }
  };

  onMouseLeaveImage = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.clearTimer();
    this.hideTimer = setTimeout(() => {
      this.setState({
        showOverlay: false,
      });
    }, 250);
  };

  showTimer = null;
  hideTimer = null;

  handleCheckBoxClick = () => {
    if (this.props.onCheckBoxClick) {
      this.props.onCheckBoxClick(this._getReturnBaseProp());
    }
  };

  handleOverlayClick = () => {
    this.handleImageClick();
  };

  _getReturnBaseProp = () => {
    const { videoId, index } = this.props;
    return {
      videoId,
      index,
      selected: !!this.props.selected,
    };
  };

  /**
   * Negate the 'selected' property and pass {video_id, index, selected} to parent
   */
  handleImageClick = () => {
    if (this.props.onImageClick) {
      this.props.onImageClick(this._getReturnBaseProp());
    }
  };

  clearTimer = () => {
    if (this.showTimer) { clearTimeout(this.showTimer); }
    if (this.hideTimer) { clearTimeout(this.hideTimer); }
  };

  render() {
    const {
      imgSrc,
      disableHover,
      index,
      onTextClick,
      selectType,
      selected,
      ad,
      disabled,
    } = this.props;
    const { showOverlay } = this.state;

    return (
      <div styleName={`ad-card ${selected ? 'selected' : ''}`}>
        {
          disabled ?
            <div
              style={{
                position: 'absolute',
                top: '42px',
                textAlign: 'center',
                width: '100%',
                zIndex: '10',
              }}
            >
              <FeedbackedLabed />
            </div>
            : null
        }
        <div styleName={disabled ? 'disabled' : ''}> {/* disabled effect mask */}
          <div
            styleName="overlap-container"
            onMouseEnter={this.onHoverImage}
            onMouseLeave={this.onMouseLeaveImage}
          >
            <div onClick={this.handleImageClick}>
              <LazyLoad once height={108}>
                <LazyloadImage src={imgSrc} alt="key moment" styleName="thumbnail" />
              </LazyLoad>
              <div styleName="time">{this.props.time}</div>
            </div>
            {
              !disabled && !disableHover && !selected && showOverlay ?
                <Hover
                  index={index}
                  onCheckBoxClick={this.handleCheckBoxClick}
                  onOverlayClick={this.handleOverlayClick}
                /> :
                null
            }
            {
              selected && selectType === 'checked' ?
                <CheckedIcon onClick={this.handleCheckBoxClick} /> :
                null
            }
          </div>
          <div
            styleName="info-container"
            onClick={() => {
              onTextClick(this._getReturnBaseProp());
            }}
          >
            <div>
              <Interpolate
                i18nKey="durationInSecond"
                second={ad.duration_second}
              />
            </div>
            <div styleName="tags" title={this.props.tagNames}>
              {this.props.tagNames}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AdCard.propTypes = {
  ad: PropTypes.object, // mark
  imgSrc: PropTypes.string.isRequired, // mark
  disableHover: PropTypes.bool, // mark
  onCheckBoxClick: PropTypes.func,
  onImageClick: PropTypes.func,
  videoId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired, // mark
  index: PropTypes.number.isRequired, // mark
  selectType: PropTypes.oneOf(['bordered', 'checked']), // mark
  onTextClick: PropTypes.func,
  time: PropTypes.string.isRequired, // mark
  selected: PropTypes.bool, // mark
  disabled: PropTypes.bool, // mark
  hideButton: PropTypes.bool, // mark
  videoFps: PropTypes.number, // mark
  tagNames: PropTypes.string, // mark
  t: PropTypes.func,
};


export default CSSModules(AdCard, styles, { allowMultiple: true });
