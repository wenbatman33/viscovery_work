import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';
import LazyLoad from 'react-lazyload';

import LazyloadImage from 'vidya/Others/LazyloadImage';

import AdButton from './AdButton';
import Hover from './Hover';
import CheckedIcon from './CheckedIcon';

import styles from './styles.scss';

class AdBlock extends React.Component {
  state = {
    showOverlay: false,
  };

  componentWillReceiveProps() {
    this.setState({
      showOverlay: false,
    });
  }

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

  handleOverlayClick = () => {
    this.handleImageClick();
  };

  handleCheckBoxClick = () => {
    if (this.props.onCheckBoxClick) {
      this.props.onCheckBoxClick(this._getReturnBaseProp());
    }
  };

  showTimer = null;
  hideTimer = null;

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
    const { imgSrc, disableHover, index, onBtnClick, selectType, selected } = this.props;
    const { showOverlay } = this.state;
    return (
      <div styleName="ad-block">
        <div
          styleName="overlap-container"
          onMouseEnter={this.onHoverImage}
          onMouseLeave={this.onMouseLeaveImage}
        >
          <div onClick={this.handleImageClick}>
            <LazyLoad once height={72}>
              <LazyloadImage alt="ad-moment" src={imgSrc} styleName={`thumbnail ${selected ? 'selected' : ''}`} />
            </LazyLoad>
            <div styleName="time">{this.props.time}</div>
          </div>
          {
            !disableHover && !selected && showOverlay ?
              <Hover
                index={index}
                onCheckBoxClick={this.handleCheckBoxClick}
                onOverlayClick={this.handleOverlayClick}
              /> :
              null
          }
          {
            selected && selectType === 'checked' ? <CheckedIcon onClick={this.handleCheckBoxClick} /> : null
          }

        </div>
        {
          this.props.hideButton ?
            <div styleName="button-holder" /> :
            <AdButton
              onClick={() => { if (onBtnClick) onBtnClick(this._getReturnBaseProp()); }}
              background={this.props.buttonBackground}
              icon={this.props.buttonIcon}
            >
              {this.props.buttonText}
            </AdButton>
        }
      </div>
    );
  }
}
AdBlock.defaultProps = {
  buttonBackground: 'white',
  buttonText: '',
};
AdBlock.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  disableHover: PropTypes.bool,
  onCheckBoxClick: PropTypes.func,
  onImageClick: PropTypes.func,
  videoId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  index: PropTypes.number.isRequired,
  buttonIcon: PropTypes.oneOf(['plus', 'wheel']).isRequired,
  buttonBackground: PropTypes.oneOf(['white', 'blue']),
  buttonText: PropTypes.string,
  selectType: PropTypes.oneOf(['bordered', 'checked']),
  onBtnClick: PropTypes.func,
  time: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  hideButton: PropTypes.bool,
};


export default CSSModules(AdBlock, styles, { allowMultiple: true });
