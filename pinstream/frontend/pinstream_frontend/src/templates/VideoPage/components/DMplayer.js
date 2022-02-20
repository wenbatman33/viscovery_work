/*global DM*/
/* global viscoveryAd*/
import React from 'react';

const divStyle = {
  overflow: 'hidden',
  height: '400px',
  width: '100%',
};

class DMplayer extends React.Component {
  constructor(props) {
    super(props);

    this.dmPlayerInit = this.dmPlayerInit.bind(this);
    this.viscoveryAdIntegrate = this.viscoveryAdIntegrate.bind(this);
    this.player = null;
  }

  componentDidMount() {
    this.dmPlayerInit();
  }

  dmPlayerInit = () => {
    this.player = DM.player(document.getElementById('dailyMotion-content-player'), {
      video: this.props.dm_id,
      width: divStyle.width,
      height: divStyle.height,
      params: {
        autoplay: false,
        mute: false,
        controls: true,
      }
    });
    this.player.addEventListener('video_start', this.viscoveryAdIntegrate);
  }

  viscoveryAdIntegrate = () => {
    console.log('%c Viscovery Ad SDK initiate ', 'background: #2E2E2E; color: #F37D63; padding: 1px;');
    viscoveryAd.init({
      contentPlayer: '#dailyMotion-content-player',
      adContainer: '#dailyMotion-adContainer',
      outStreamContainer: '#outstream',
      apiKey: '873cbd49-738d-406c-b9bc-e15588567b39',
      videoId: '170814',
      playerControl: {
        getCurrentTime: this.player.currentTime,
      },
      bottomOffset: 30,
      mobileFullscreenHacking: true,
    });
  }

  render() {
    return (
      <div>
        <div id="content">
          <div id="dailyMotion-content-player" />
        </div>
        <div id="dailyMotion-adContainer" className="adContainer" />
      </div>
    );
  }
}

DMplayer.propTypes = {
  dm_id: React.PropTypes.string,
};

export default DMplayer;
