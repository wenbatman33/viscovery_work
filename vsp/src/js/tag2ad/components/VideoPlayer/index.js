import PropTypes from 'prop-types';
import React from 'react';
import videojs from 'video.js';

// import ProgressBar from './ProgressBar';
// import VolumeControl from './VolumeControl';
// import CurrentDisplay from './CurrentDisplay';
// import PlayControl from './PlayControl';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.handleCurrentTime = this.handleCurrentTime.bind(this);
    this.handleVolume = this.handleVolume.bind(this);

    this.state = {
      currentTime: 0,
      volume: 0,
      duration: 0,
    };
  }

  componentDidMount() {
    // use video.js
    this.foo = videojs(this.player, {
      controlBar: {
        remainingTimeDisplay: false,
        fullscreenToggle: false,
      },
    }, this.handleReady);

    const { src, time } = this.props;
    if (src) {
      this.foo.src(src);
      this.foo.load();
    }
    if (time) {
      this.foo.currentTime(time);
    }

    const self = this;
    // remove video.js default skin
    // document.querySelector('.vjs-styles-dimensions').remove()
    // document.querySelector('.vjs-styles-defaults').remove()

    this.player.addEventListener('timeupdate', (e) => {
      self.setState({
        currentTime: (e.target.currentTime),
      });
    });

    this.player.addEventListener('volumechange', (e) => {
      self.setState({
        volume: (e.target.volume),
      });
    });

    this.player.addEventListener('loadedmetadata', () => {
      self.setState({
        duration: self.player.duration,
      });
    });

    this.player.addEventListener('ended', () => {
      self.setState({
        putPlay: getPutPlay(self.player),
      });
    });

    this.player.addEventListener('pause', () => {
      self.setState({
        putPlay: getPutPlay(self.player),
      });
    });

    this.player.addEventListener('play', () => {
      self.setState({
        putPlay: getPutPlay(self.player),
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src && nextProps.src !== this.props.src) {
      this.foo.src(nextProps.src);
      this.foo.load();
    }
    if (nextProps.time && nextProps.time !== this.props.time) {
      this.foo.currentTime(nextProps.time);
    }
  }

  handleCurrentTime(ratio) {
    this.player.currentTime = ratio * this.player.duration;
  }

  handleVolume(volume) {
    this.player.volume = volume;
  }

  playOrPause() {
    if (!this.player.paused && !this.player.ended) {
      this.pause();
      return;
    }

    this.play();
    return;
  }

  toTime(sec) {
    this.player.currentTime = sec;
  }

  toggleMute() {
    this.player.muted = !this.player.muted;
  }

  pause() {
    this.player.pause();
  }

  play() {
    this.player.play();
  }

  handleReady = () => {
    const controls = this.foo.$$('.vjs-time-control');
    for (const control of controls) {
      control.style.cssText = 'display: inline-block;';
    }

    const self = this;

    this.setState({
      currentTime: self.player.currentTime,
      volume: self.player.volume,
      duration: self.player.duration,
      putPlay: getPutPlay(self.player),
    });
  };

  render() {
    const { className, ...rest } = this.props;

    return (
      <div className={className}>
        <video
          {...rest}
          className={'video-js vjs-big-play-centered'}
          ref={(ref) => { this.player = ref; }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        {/* <ProgressBar
          handleCurrentTime={this.handleCurrentTime}
          currentRatio={this.state.currentTime / this.state.duration}
          markerPosition={[0, 10, 50, 100]}
        />
        <VolumeControl
          volume={this.state.volume}
          onChange={this.handleVolume}
        />
        <CurrentDisplay
          currentTime={this.state.currentTime}
          duration={this.state.duration}
        />
        <PlayControl
          putPlay={this.state.putPlay}
          onClick={() => {this.playOrPause()}}
        /> */}
      </div>
    );
  }
}

const getPutPlay = player => player.ended || player.paused;

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  time: PropTypes.number,
  autoPlay: PropTypes.bool,
  controls: PropTypes.bool,
  className: PropTypes.string,
};


VideoPlayer.defaultProps = {
  autoPlay: false,
  controls: true,
};

export default VideoPlayer;
