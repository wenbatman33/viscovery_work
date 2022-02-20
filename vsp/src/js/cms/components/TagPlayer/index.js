import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';
import videojs from 'video.js';

import { ApiConfigHOC } from '../../../shared/hoc';
import { urlUtil } from '../../../utils';

import styles from './styles.scss';

class TagPlayer extends React.Component {
  static propTypes = {
    video: PropTypes.shape({
      src: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    frames: PropTypes.arrayOf(
      PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        brands: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            rect: PropTypes.shape({
              left: PropTypes.number.isRequired,
              top: PropTypes.number.isRequired,
              width: PropTypes.number.isRequired,
              height: PropTypes.number.isRequired,
            }).isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
    time: PropTypes.number,
    videoHost: PropTypes.string,
  };

  static defaultProps = {
    video: {
      src: null,
      width: 1024,
      height: 768,
    },
    frames: [],
  };

  componentDidMount() {
    const { video, videoHost } = this.props;
    this.player = videojs(this.video, {
      fluid: true,
      controlBar: {
        remainingTimeDisplay: false,
        fullscreenToggle: false,
      },
    }, this.handleReady);
    if (video.src) {
      this.player.src(urlUtil.addHostPrefix(video.src, videoHost));
      this.player.load();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.video.src !== this.props.video.src) {
      if (nextProps.video.src) {
        this.player.src(urlUtil.addHostPrefix(nextProps.video.src, nextProps.videoHost));
        this.player.load();
      }
    }

    if (nextProps.time && nextProps.time !== this.props.time) {
      this.player.currentTime(nextProps.time);
    }
  }

  componentWillUnmount() {
    this.player.dispose();
  }

  handleOverlay = () => {
    const { overlay } = this;
    while (overlay.firstChild) {
      overlay.removeChild(overlay.firstChild);
    }

    if (this.frameIndex >= 0) {
      const { video } = this.props;
      const horizontalRatio = overlay.offsetWidth / video.width;
      const verticalRatio = overlay.offsetHeight / video.height;
      let ratio;
      if (horizontalRatio < verticalRatio) {
        ratio = horizontalRatio;
      } else {
        ratio = verticalRatio;
      }
      const frame = this.props.frames[this.frameIndex];
      for (const brand of frame.brands) {
        const left = brand.rect.left * ratio;
        const top = brand.rect.top * ratio;
        const width = brand.rect.width * ratio;
        const height = brand.rect.height * ratio;
        const rect = document.createElement('div');
        rect.title = brand.name;
        rect.style.cssText =
          'position: absolute;' +
          `left: ${left}px;` +
          `top: ${top}px;` +
          `width: ${width}px;` +
          `height: ${height}px;` +
          'border: 2px solid red;';
        const text = document.createElement('div');
        text.style.cssText =
          'position: absolute;' +
          'left: 0;' +
          'top: 0;' +
          'padding: 5px;' +
          'background: red;' +
          'color: white;' +
          'font-size: 1.5em;' +
          'white-space: nowrap;';
        rect.appendChild(text);
        const node = document.createTextNode(brand.name);
        text.appendChild(node);
        overlay.append(rect);
      }
    }
  };

  handleTimeUpdate = () => {
    const { frames } = this.props;
    const time = Math.round(this.player.currentTime() * 1000) / 1000;
    let frameIndex = -1;
    for (const key of Object.keys(frames)) {
      const frame = frames[key];
      if (time >= frame.start && time < frame.end) {
        frameIndex = key;
      }
    }
    if (frameIndex !== this.frameIndex) {
      this.frameIndex = frameIndex;
      this.handleOverlay();
    }
  };

  handleTimeRewind = () => {
    this.player.currentTime(this.props.time);
  };

  handleReady = () => {
    const controls = this.player.$$('.vjs-time-control');
    for (const control of controls) {
      control.style.cssText = 'display: inline-block;';
    }

    this.overlay = document.createElement('div');
    this.overlay.style.cssText = 'position: absolute; bottom: 0; width: 100%; height: 100%; color: red;';
    const control = this.player.$('.vjs-big-play-button');
    control.parentNode.insertBefore(this.overlay, control);
    this.player.on('timeupdate', this.handleTimeUpdate);
  };

  render() {
    return (
      <div styleName="component">
        <video className="video-js vjs-big-play-centered" ref={(node) => { this.video = node; }} controls />
      </div>
    );
  }
}

export default ApiConfigHOC(CSSModules(TagPlayer, styles));
