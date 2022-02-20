/*global YT*/
/* global viscoveryAd*/

import React from 'react';

let loadYT;

const divStyle = {
  overflow: 'hidden',
  height: '400px',
  width: '100%',
};

class YoutubePlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player: null,
      oldTime: 0,
    };

    this._onReady = this._onReady.bind(this);
    this.getPlayerState = this.getPlayerState.bind(this);
    this._returnUpdatedTime = this._returnUpdatedTime.bind(this);
  }

  componentDidMount() {
    if (!loadYT) {
      loadYT = new Promise((resolve) => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = () => resolve(window.YT);
      });
    }
    loadYT.then((YT) => {
      const player = new YT.Player('youtube-content-player', {
        height: divStyle.height,
        width: divStyle.width,
        videoId: this.props.ytp_id,
        events: {
          onReady: this._onReady,
        }
      });
      this.setState({...this.state, player});
    });
  }

  getPlayerState = () => {
    const state = this.state.player.getPlayerState();
    if (state === 1) {
      return 'false';
    } else if (state === 2) {
      return 'true';
    }
    return true;
  };

  _returnUpdatedTime = (updateTrigger) => {
    setInterval(() => {
      if (this.state.oldTime !== this.state.player.getCurrentTime()) {
        updateTrigger(this.state.player.getCurrentTime());
        this.setState({
          ...this.state,
          oldTime: this.state.player.getCurrentTime()
        });
      }
    }, 1000);
  };

  _onReady = () => {
    console.log('%c Viscovery Ad SDK initiate ', 'background: #2E2E2E; color: #F37D63; padding: 1px;');
    viscoveryAd.init({
      contentPlayer: '#youtube-content-player',
      adContainer: '#youtube-adContainer',
      outStreamContainer: '#outstream',
      apiKey: '873cbd49-738d-406c-b9bc-e15588567b39',
      videoId: '0817',
      playerControl: {
        play: this.state.player.playVideo.bind(this.state.player),
        pause: this.state.player.pauseVideo.bind(this.state.player),
        getCurrentTime: this.state.player.getCurrentTime.bind(this.state.player),
        getPaused: this.getPlayerState.bind(this.state.player),
        onTimeUpdate: this._returnUpdatedTime.bind(this),
      },
      bottomOffset: 30,
      mobileFullscreenHacking: true,
    });
  }

  render() {
    return (
      <div>
        <div id="content">
          <div id="youtube-content-player" />
        </div>
        <div id="youtube-adContainer" className="adContainer" />
      </div>
    );
  }
}

YoutubePlayer.propTypes = {
  ytp_id: React.PropTypes.string,
};

export default YoutubePlayer;
